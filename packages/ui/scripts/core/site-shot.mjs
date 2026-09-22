/**
 * Takes a screenshot of a site, for "Generate from URL".
 *
 * The seeds are read from what the page actually looks like. Reading the CSS
 * guesses at it, and a site's og:image is often missing, WebP, or a poster
 * that looks nothing like the page — povbudapest.com's is orange on cream
 * reversed. A screenshot is the thing the designer is reacting to.
 *
 * Deployed, this runs @sparticuz/chromium inside the Vercel function. Locally
 * it uses the Chromium Playwright has already downloaded.
 *
 * A headless browser loading a stranger's URL on the server is SSRF with
 * extra steps: the page can ask for any address, including private ones. Every
 * request the page makes is checked the same way the page itself was, and
 * anything pointing inward is refused before it leaves.
 */

import { assertPublicUrl } from "./site-fetch.mjs"

const VIEWPORT = { width: 1440, height: 900 }
const LIMITS = {
  // the whole screenshot, so a slow site cannot hold the function
  total: 30_000,
  // after load, for intro animations and preloaders to clear
  settle: 2500,
}

async function launch() {
  const { chromium } = await import("playwright-core")
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const { default: serverless } = await import("@sparticuz/chromium")
    return chromium.launch({
      executablePath: await serverless.executablePath(),
      args: serverless.args,
      headless: true,
    })
  }
  return chromium.launch({ headless: true })
}

/**
 * Runs inside the page. Reads the styles the browser computed, so the seeds
 * can use the site's exact values: the screenshot says which colours are on
 * screen, but a pixel only approximates the colour behind it (JPEG turns
 * #ff4800 into #fe4800, antialiasing blends edges).
 *
 *   palette — every colour any element on the first screen declares:
 *             background, text, border, SVG fill and stroke, exact sRGB hex
 *   applied — the same for every rendered element on the whole page, with
 *             its area: colours the CSS really puts on something, as opposed
 *             to rules for a popup or a 404 page that never render here
 *   fonts   — the family each piece of on-screen text renders in, with the
 *             area it covers and the largest size it is set at
 */
function collectStyles() {
  const W = innerWidth
  const H = innerHeight
  const ctx = Object.assign(document.createElement("canvas"), { width: 1, height: 1 }).getContext(
    "2d",
    { willReadFrequently: true }
  )
  const cache = new Map()
  // Any CSS colour syntax (rgb, oklch, color(), named) to exact 8-bit sRGB hex,
  // or null when it is mostly transparent.
  const hex = (value) => {
    if (!value || value === "transparent" || value === "none") return null
    if (cache.has(value)) return cache.get(value)
    ctx.clearRect(0, 0, 1, 1)
    ctx.fillStyle = "#000"
    ctx.fillStyle = value
    ctx.fillRect(0, 0, 1, 1)
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data
    const out = a < 128 ? null : "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")
    cache.set(value, out)
    return out
  }
  const visibleArea = (rect) =>
    Math.max(0, Math.min(rect.right, W) - Math.max(rect.left, 0)) *
    Math.max(0, Math.min(rect.bottom, H) - Math.max(rect.top, 0))
  const shown = (el) =>
    !el.checkVisibility || el.checkVisibility({ opacityProperty: true, visibilityProperty: true })

  const palette = new Set()
  const applied = {}
  let area = 0
  const add = (value) => {
    const h = hex(value)
    if (!h) return
    applied[h] = (applied[h] ?? 0) + area
    if (onScreen) palette.add(h)
  }
  let onScreen = true
  add(getComputedStyle(document.documentElement).backgroundColor)
  add(getComputedStyle(document.body).backgroundColor)
  const all = document.querySelectorAll("body, body *")
  for (let i = 0; i < Math.min(all.length, 8000); i++) {
    const el = all[i]
    const rect = el.getBoundingClientRect()
    area = rect.width * rect.height
    if (!area || !shown(el)) continue
    onScreen = visibleArea(rect) > 0
    const style = getComputedStyle(el)
    add(style.backgroundColor)
    add(style.color)
    if (parseFloat(style.borderTopWidth)) add(style.borderTopColor)
    if (el instanceof SVGElement) {
      add(style.fill)
      add(style.stroke)
    }
  }

  const fonts = {}
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  const range = document.createRange()
  for (let node = walker.nextNode(), n = 0; node && n < 4000; node = walker.nextNode(), n++) {
    if (!node.textContent.trim()) continue
    const el = node.parentElement
    if (!el || !shown(el)) continue
    range.selectNodeContents(node)
    const area = [...range.getClientRects()].reduce((sum, r) => sum + visibleArea(r), 0)
    if (!area) continue
    const style = getComputedStyle(el)
    // the first family in the stack is the one the site chose
    const family = style.fontFamily.split(",")[0].trim().replace(/^["']|["']$/g, "")
    const f = (fonts[family] ??= { area: 0, maxSize: 0 })
    f.area += area
    f.maxSize = Math.max(f.maxSize, parseFloat(style.fontSize))
  }

  return {
    palette: [...palette],
    applied: Object.entries(applied)
      .map(([hex, a]) => ({ hex, share: a / (W * H) }))
      .sort((a, b) => b.share - a.share),
    fonts: Object.entries(fonts)
      .map(([family, f]) => ({ family, share: f.area / (W * H), maxSize: f.maxSize }))
      .sort((a, b) => b.share - a.share),
  }
}

/**
 * The page's first screen as a JPEG, and the styles computed for it; null if
 * the site could not be shown. Never throws: a failure falls back to reading
 * the CSS.
 */
export async function screenshotSite(url) {
  let browser
  let timedOut = false
  let timer
  const deadline = new Promise((resolve) => {
    timer = setTimeout(() => {
      timedOut = true
      resolve(null)
    }, LIMITS.total)
  })

  const shoot = async () => {
    browser = await launch()
    // the deadline may have passed while Chromium was starting
    if (timedOut) throw new Error("timed out")
    const context = await browser.newContext({
      viewport: VIEWPORT,
      deviceScaleFactor: 1,
      acceptDownloads: false,
      serviceWorkers: "block",
    })

    const checked = new Map()
    await context.route("**/*", async (route) => {
      const request = route.request()
      // video and audio change nothing about the colours and cost the most
      if (request.resourceType() === "media") return route.abort()
      const { protocol, host } = new URL(request.url())
      if (protocol === "data:" || protocol === "blob:") return route.continue()
      if (!checked.has(host)) {
        checked.set(
          host,
          assertPublicUrl(request.url()).then(
            () => true,
            () => false
          )
        )
      }
      return (await checked.get(host)) ? route.continue() : route.abort("blockedbyclient")
    })

    const page = await context.newPage()
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: LIMITS.total })
    await page.waitForLoadState("load", { timeout: 8000 }).catch(() => {})
    await page.waitForTimeout(LIMITS.settle)
    // PNG to sample, so flat colours arrive unchanged; JPEG to show, for size
    const pixels = await page.screenshot({ type: "png" })
    const image = await page.screenshot({ type: "jpeg", quality: 75 })
    const styles = await page.evaluate(collectStyles).catch(() => null)
    return { pixels, image, styles }
  }

  const shot = shoot()
  // once the deadline wins, the losing screenshot must not reject unhandled
  shot.catch(() => {})
  try {
    return await Promise.race([shot, deadline])
  } catch {
    return null
  } finally {
    clearTimeout(timer)
    await browser?.close().catch(() => {})
  }
}
