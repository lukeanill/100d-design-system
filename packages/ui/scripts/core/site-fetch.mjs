/**
 * Fetches a page and its stylesheets so site-theme.mjs can read them.
 *
 * Shared by the dev server and the deployed API so "pull theme" behaves the
 * same in both. Everything network- and safety-related is here; the reading of
 * what comes back is pure and lives next door.
 *
 * This takes a URL a person typed and fetches it from the server, which is a
 * request the server makes on a stranger's behalf. That is the shape of SSRF,
 * so the host is resolved and checked before anything is fetched: a URL
 * pointing at localhost or a private range would otherwise let the studio read
 * things on the network the person cannot reach themselves.
 */

import dns from "node:dns/promises"
import { isIP } from "node:net"

import jpeg from "jpeg-js"
import { PNG } from "pngjs"

import {
  extractSiteTheme,
  fontsFromStyles,
  googleAlternative,
  colorsIn,
  cssColorRanking,
  mixSeeds,
  rolesFromImage,
  snapToDeclared,
} from "./site-theme.mjs"

const UA = "Mozilla/5.0 (compatible; 100DS-ThemeStudio/1.0; +https://www.lukeai.space)"

/**
 * Caps, so one pathological page cannot exhaust the function.
 *
 * `sheets` is high because large sites split CSS hard — GitHub links forty, and
 * the font declarations are nowhere near the first eight. They are fetched
 * together rather than one after another, so the ceiling is the slowest sheet
 * rather than the sum of all of them.
 */
const LIMITS = {
  html: 2_000_000,
  sheet: 400_000,
  sheets: 24,
  totalCss: 4_000_000,
  image: 8_000_000,
  ms: 8000,
}

const PRIVATE_V4 = [
  [10, 0, 0, 0, 8],
  [127, 0, 0, 0, 8],
  [169, 254, 0, 0, 16],
  [172, 16, 0, 0, 12],
  [192, 168, 0, 0, 16],
  [100, 64, 0, 0, 10],
  [0, 0, 0, 0, 8],
]

function isPrivateV4(ip) {
  const parts = ip.split(".").map(Number)
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return true
  const value = parts.reduce((acc, n) => acc * 256 + n, 0)
  return PRIVATE_V4.some(([a, b, c, d, bits]) => {
    const base = ((a * 256 + b) * 256 + c) * 256 + d
    const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0
    return (value & mask) === (base & mask)
  })
}

const isPrivateV6 = (ip) => {
  const v = ip.toLowerCase()
  return v === "::1" || v === "::" || /^f[cd]/.test(v) || /^fe80/.test(v) || v.startsWith("::ffff:")
}

/** Throws unless the URL is a public http(s) address. */
export async function assertPublicUrl(raw) {
  let url
  try {
    // Only bare hosts get a scheme added. Prepending to anything that already
    // has one turns file:///etc/passwd into https://file/etc/passwd, which then
    // fails as a bad hostname instead of as the wrong protocol it is.
    const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(raw.trim())
    url = new URL(hasScheme ? raw.trim() : `https://${raw.trim()}`)
  } catch {
    throw new Error("That does not look like a web address.")
  }
  if (!/^https?:$/.test(url.protocol)) {
    throw new Error("Only http and https addresses can be read.")
  }

  // URL keeps the brackets on an IPv6 host; isIP does not want them
  const host = url.hostname.replace(/^\[|\]$/g, "")
  const literal = isIP(host)
  const addresses = literal
    ? [{ address: host, family: literal }]
    : await dns.lookup(host, { all: true }).catch(() => {
        throw new Error(`Could not find ${host}.`)
      })

  for (const { address, family } of addresses) {
    const blocked = family === 6 ? isPrivateV6(address) : isPrivateV4(address)
    if (blocked) throw new Error("That address is on a private network.")
  }
  return url
}

const withTimeout = async (url, ms) => {
  const control = new AbortController()
  const timer = setTimeout(() => control.abort(), ms)
  try {
    return await fetch(url, {
      headers: { "user-agent": UA, accept: "text/html,text/css,*/*" },
      redirect: "follow",
      signal: control.signal,
    })
  } finally {
    clearTimeout(timer)
  }
}

const capped = async (res, limit) => (await res.text()).slice(0, limit)

/**
 * Fetch and decode the site's preview image to RGBA, or null when there is
 * none or it is in a format we do not read (WebP, AVIF, SVG). JPEG and PNG
 * cover nearly every og:image; the decoders are pure JS so the serverless
 * function needs no native binaries.
 */
async function loadImage(href) {
  try {
    await assertPublicUrl(href)
    const res = await withTimeout(href, LIMITS.ms)
    if (!res.ok) return null
    const bytes = Buffer.from(await res.arrayBuffer())
    if (bytes.length > LIMITS.image) return null
    return decode(bytes)
  } catch {
    // an unreadable image falls back to reading the CSS, not to an error
    return null
  }
}

/** JPEG or PNG bytes to RGBA pixels; null for any other format. */
function decode(bytes) {
  try {
    if (bytes[0] === 0xff && bytes[1] === 0xd8) {
      return jpeg.decode(bytes, { useTArray: true, formatAsRGBA: true, maxResolutionInMP: 40 })
    }
    if (bytes.subarray(0, 4).toString("hex") === "89504e47") return PNG.sync.read(bytes)
  } catch {
    // a corrupt image is treated like a missing one
  }
  return null
}

/**
 * Read a site and guess its theme.
 * @returns the shape extractSiteTheme returns, plus the URL actually landed on.
 */
export async function fetchSiteTheme(raw, { screenshot = true } = {}) {
  const url = await assertPublicUrl(raw)

  const res = await withTimeout(url.href, LIMITS.ms)
  if (!res.ok) {
    throw new Error(
      res.status === 403 || res.status === 401
        ? "That site refused the request — some block automated readers."
        : `That site answered ${res.status}.`
    )
  }
  const html = await capped(res, LIMITS.html)
  const landed = res.url || url.href

  const hrefs = [...html.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]*>/gi)]
    .map((tag) => /href\s*=\s*["']([^"']+)["']/i.exec(tag[0])?.[1])
    .filter(Boolean)
    // reset sheets are browser defaults, not the site's design: normalize.css
    // alone contributes the yellow it gives <mark>
    .filter((href) => !/(^|\/)(normalize|reset|sanitize)(\.min)?\.css/i.test(href))
    .slice(0, LIMITS.sheets)

  const sheets = await Promise.allSettled(
    hrefs.map(async (href) => {
      const sheet = new URL(href, landed)
      // a stylesheet is fetched the same way as the page, so a page cannot use
      // its own <link> to point the server somewhere it could not reach itself
      await assertPublicUrl(sheet.href)
      const r = await withTimeout(sheet.href, LIMITS.ms)
      return r.ok ? await capped(r, LIMITS.sheet) : ""
    })
  )

  let css = ""
  for (const sheet of sheets) {
    // one unreachable stylesheet should not lose the whole read
    if (sheet.status !== "fulfilled") continue
    if (css.length >= LIMITS.totalCss) break
    css += "\n" + sheet.value
  }

  // style blocks in the page itself, which is where small sites keep everything
  for (const [, block] of html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)) {
    css += "\n" + block.slice(0, LIMITS.sheet)
  }

  const found = extractSiteTheme({ html, css, url: landed })

  // The screenshot decides which colours are on screen; the styles the page
  // declares supply their exact values. Without a screenshot, the og:image
  // stands in, and the CSS reading fills any role left over.
  const shot = screenshot ? await (await import("./site-shot.mjs")).screenshotSite(landed) : null
  const image = shot
    ? decode(shot.pixels)
    : found.preview.ogImage
      ? await loadImage(found.preview.ogImage)
      : null
  const pictured = image ? rolesFromImage(image) : {}
  const declared = new Set([...(shot?.styles?.palette ?? []), ...colorsIn(css)])
  const exact = snapToDeclared(pictured, declared)
  // A primary or secondary the site never declares came from a photograph,
  // not a token; the declared ink or page colour stands in, as it does on any
  // site with no second colour.
  if (shot?.styles) {
    if (exact.primary && !declared.has(exact.primary)) exact.primary = exact.foreground
    if (exact.secondary && !declared.has(exact.secondary)) exact.secondary = exact.background
  }
  // then the CSS: where the screenshot shows no accent, the one the site's
  // CSS uses most steps in
  const mixed = shot ? mixSeeds(
        exact,
        cssColorRanking(html, css),
        shot.styles?.palette,
        shot.styles?.applied.map((c) => c.hex)
      ) : exact
  const seeds = { ...found.seeds }
  for (const [role, hex] of Object.entries(mixed)) if (hex) seeds[role] = hex

  // The exact families the page renders in. The editor needs faces it can
  // load, so each is swapped for a Google stand-in when it is not one — and
  // both names are kept, so the record says what the site really uses.
  const exactFonts = fontsFromStyles(shot?.styles)
  const fonts = { ...found.fonts }
  // when the page's real families are known, only their swaps are worth
  // reporting — the CSS reading also lists fallbacks like Segoe UI
  const substituted = exactFonts.body ? [] : [...found.substituted]
  if (exactFonts.body) {
    for (const [role, family] of Object.entries(exactFonts)) {
      const alt = googleAlternative(family, found.googleFamilies)
      fonts[role] = alt ?? family
      if (alt && !substituted.some((s) => s.found === family)) substituted.push({ found: family, using: alt })
    }
  }

  return {
    ...found,
    seeds,
    fonts,
    exactFonts,
    substituted,
    /** Which seeds matched a colour the site declares exactly, and which were sampled. */
    exactSeeds: Object.fromEntries(
      Object.entries(exact).map(([role, hex]) => [role, declared.has(hex)])
    ),
    styles: shot?.styles ?? null,
    preview: {
      ...found.preview,
      screenshot: shot ? `data:image/jpeg;base64,${shot.image.toString("base64")}` : null,
    },
    colorSource: shot ? "screenshot" : pictured.background ? "image" : "css",
    url: landed,
    sheets: hrefs.length,
  }
}
