/**
 * Reads a website's HTML and CSS and guesses the theme behind it.
 *
 * Pure: it takes text that someone else fetched and returns findings. The
 * fetching, with all the network and safety concerns that carries, lives in the
 * endpoints; this file can be tested against a fixture with no network at all.
 *
 * Everything here is a guess presented as a starting point. The studio fills
 * the fields and the designer corrects them — which is why each finding carries
 * where it came from, so a value read from a `--brand-primary` custom property
 * can be trusted more than one counted out of a heap of declarations.
 */

import { hexToOklch } from "../../tokens/lib/color.mjs"

/* ---------------------------------------------------------------- colours -- */

const clamp255 = (n) => Math.max(0, Math.min(255, Math.round(n)))
const toHex = (r, g, b) =>
  "#" + [r, g, b].map((v) => clamp255(v).toString(16).padStart(2, "0")).join("")

/** hsl() → hex, so every colour downstream is one shape. */
function hslToHex(h, s, l) {
  const S = s / 100
  const L = l / 100
  const k = (n) => (n + h / 30) % 12
  const a = S * Math.min(L, 1 - L)
  const f = (n) => L - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return toHex(f(0) * 255, f(8) * 255, f(4) * 255)
}

const HEX = /#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/g
const RGB = /rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/g
const HSL = /hsla?\(\s*([\d.]+)(?:deg)?[\s,]+([\d.]+)%[\s,]+([\d.]+)%/g

/** Every colour in a chunk of CSS, normalised to hex. */
export function colorsIn(css) {
  const out = []
  for (const [, body] of css.matchAll(HEX)) {
    const full = body.length === 3 ? [...body].map((c) => c + c).join("") : body
    out.push("#" + full.toLowerCase())
  }
  for (const [, r, g, b] of css.matchAll(RGB)) out.push(toHex(+r, +g, +b))
  for (const [, h, s, l] of css.matchAll(HSL)) out.push(hslToHex(+h, +s, +l))
  return out
}

const describe = (hex) => {
  try {
    const { L, C } = hexToOklch(hex)
    return { hex, L, C }
  } catch {
    return null
  }
}

/* ------------------------------------------------------------------ fonts -- */

const GENERIC = new Set([
  "serif", "sans-serif", "monospace", "cursive", "fantasy", "system-ui",
  "ui-sans-serif", "ui-serif", "ui-monospace", "ui-rounded", "inherit",
  "initial", "unset", "revert", "none", "-apple-system", "blinkmacsystemfont",
])

/**
 * Google families that stand in for the faces sites actually license.
 *
 * Substitutions, not equivalents — the shapes rhyme, the metrics do not. It is
 * a starting point that loads, which beats a field naming a font the browser
 * will never find.
 */
const GOOGLE_LOOKALIKE = {
  "helvetica": "Inter",
  "helvetica neue": "Inter",
  "helvetica now": "Inter",
  "helvetica now text": "Inter",
  "helvetica now display": "Inter",
  "arial": "Inter",
  "neue haas grotesk": "Inter",
  "akzidenz grotesk": "Inter",
  "sf pro": "Inter",
  "sf pro text": "Inter",
  "sf pro display": "Inter",
  "-apple-system": "Inter",
  "segoe ui": "Inter",
  "roboto": "Inter",
  "proxima nova": "Montserrat",
  "gotham": "Montserrat",
  "montserrat": "Montserrat",
  "futura": "Jost",
  "avenir": "Nunito Sans",
  "avenir next": "Nunito Sans",
  "circular": "Nunito Sans",
  "brandon grotesque": "Josefin Sans",
  "gill sans": "Lato",
  "trade gothic": "Oswald",
  "din": "Archivo",
  "graphik": "Libre Franklin",
  "georgia": "Lora",
  "times": "Source Serif 4",
  "times new roman": "Source Serif 4",
  "garamond": "EB Garamond",
  "adobe garamond": "EB Garamond",
  "didot": "Playfair Display",
  "bodoni": "Playfair Display",
  "caslon": "EB Garamond",
  "menlo": "JetBrains Mono",
  "consolas": "JetBrains Mono",
  "sf mono": "JetBrains Mono",
  "courier": "JetBrains Mono",
  "courier new": "JetBrains Mono",
}

/** Last resort when the name is unknown: match the shape, not the name. */
const BY_SHAPE = { serif: "Lora", mono: "JetBrains Mono", sans: "Inter" }

export function shapeOf(family) {
  const n = family.toLowerCase()
  if (/mono|code|courier|consol/.test(n)) return "mono"
  if (/serif|georgia|times|garamond|didot|bodoni|caslon|playfair|roman/.test(n)) {
    return /sans[- ]?serif/.test(n) ? "sans" : "serif"
  }
  return "sans"
}

/**
 * A Google family to stand in for one the browser cannot load.
 * `null` when the family is already a Google font and needs no substitute.
 */
export function googleAlternative(family, googleFamilies = []) {
  const name = family.trim()
  const lower = name.toLowerCase()
  if (googleFamilies.some((g) => g.toLowerCase() === lower)) return null
  return GOOGLE_LOOKALIKE[lower] ?? BY_SHAPE[shapeOf(name)]
}

const cleanFamily = (raw) =>
  raw.trim().replace(/^["']|["']$/g, "").replace(/\s+/g, " ").trim()

/**
 * Custom properties and their values, so `var(--x)` can be followed.
 *
 * Modern sites rarely write `font-family: "Foo"` any more; they write
 * `font-family: var(--fontStack-sansSerif)` and define that once. Without this
 * a site like GitHub reports no fonts at all.
 */
export function customProperties(css) {
  const vars = new Map()
  for (const [, name, value] of css.matchAll(/(--[\w-]+)\s*:\s*([^;}]+)/g)) {
    if (!vars.has(name)) vars.set(name, value.trim())
  }
  return vars
}

/** Follow `var(--x)`, and the `var(--y, fallback)` form, a few hops deep. */
const deref = (value, vars, depth = 0) => {
  if (depth > 4 || !value.includes("var(")) return value
  const next = value.replace(/var\(\s*(--[\w-]+)\s*(?:,([^)]*))?\)/g, (whole, name, fallback) =>
    vars.get(name) ?? fallback?.trim() ?? whole
  )
  return next === value ? value : deref(next, vars, depth + 1)
}

/** Families named by `font-family`, most used first, generics dropped. */
export function familiesIn(css) {
  const vars = customProperties(css)
  const counts = new Map()
  for (const [, raw] of css.matchAll(/font-family\s*:\s*([^;}]+)/gi)) {
    const stack = deref(raw, vars)
    for (const part of stack.split(",")) {
      const family = cleanFamily(part)
      if (!family || GENERIC.has(family.toLowerCase()) || family.includes("var(")) continue
      counts.set(family, (counts.get(family) ?? 0) + 1)
      break // only the first real family in a stack is the site's choice
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([family]) => family)
}

/** Families the site loads from Google, which can be used as they are. */
export function googleFamiliesIn(html, css) {
  const found = new Set()
  const source = `${html}\n${css}`
  for (const [, query] of source.matchAll(/fonts\.googleapis\.com\/css2?\?([^"'&\s)]+)/g)) {
    for (const [, family] of query.matchAll(/family=([^&:]+)/g)) {
      found.add(decodeURIComponent(family.replace(/\+/g, " ")).trim())
    }
  }
  return [...found]
}

/** Families declared by @font-face — self-hosted, so almost certainly licensed. */
export function selfHostedFamiliesIn(css) {
  const found = new Set()
  for (const [, block] of css.matchAll(/@font-face\s*\{([^}]*)\}/gi)) {
    const m = /font-family\s*:\s*([^;}]+)/i.exec(block)
    if (m) {
      const family = cleanFamily(m[1])
      if (family && !GENERIC.has(family.toLowerCase())) found.add(family)
    }
  }
  return [...found]
}

/* ---------------------------------------------------------------- preview -- */

const metaContent = (html, pattern) => {
  const tag = new RegExp(`<meta[^>]+${pattern}[^>]*>`, "i").exec(html)?.[0]
  return tag ? /content\s*=\s*["']([^"']+)["']/i.exec(tag)?.[1] ?? null : null
}

const absolute = (href, base) => {
  try {
    return new URL(href, base).href
  } catch {
    return null
  }
}

/* ----------------------------------------------------------------- roles -- */

/**
 * Sort candidate colours into the four seeds the studio asks for.
 *
 * Background and foreground are the extremes of lightness — a page is mostly
 * one and reads in the other. Primary and secondary are the most chromatic
 * colours left, because that is what a brand colour is: the thing that is not
 * grey. Hues are kept apart so a brand does not fill both slots with two
 * shades of itself.
 */
export function assignRoles(hexes, { themeColor } = {}) {
  const seen = new Set()
  const colors = []
  for (const hex of hexes) {
    if (seen.has(hex)) continue
    seen.add(hex)
    const d = describe(hex)
    if (d) colors.push(d)
  }
  if (!colors.length) return {}

  const byLight = [...colors].sort((a, b) => b.L - a.L)
  const background = byLight[0]
  const foreground = byLight[byLight.length - 1]

  const chromatic = colors
    .filter((c) => c.C >= 0.04 && c !== background && c !== foreground)
    .sort((a, b) => b.C - a.C)

  const primary = themeColor ? describe(themeColor) ?? chromatic[0] : chromatic[0]
  // a different hue, so the two seeds are not one brand colour twice
  const secondary = chromatic.find(
    (c) => c !== primary && (!primary || Math.abs(c.L - primary.L) > 0.12)
  )

  return {
    background: background?.hex,
    foreground: foreground?.hex,
    primary: primary?.hex,
    secondary: secondary?.hex,
  }
}

/* ------------------------------------------------------------- the whole -- */

/**
 * @param html  the page's HTML
 * @param css   every stylesheet the caller managed to fetch, concatenated
 * @param url   the page's own URL, for resolving relative image paths
 */
export function extractSiteTheme({ html = "", css = "", url = "" }) {
  const all = `${html}\n${css}`

  const themeColor = metaContent(html, 'name=["\']theme-color["\']')
  const seeds = assignRoles(colorsIn(all), {
    themeColor: themeColor && /^#/.test(themeColor.trim()) ? themeColor.trim() : undefined,
  })

  const google = googleFamiliesIn(html, css)
  const selfHosted = selfHostedFamiliesIn(css)
  const ranked = familiesIn(all)

  // a family the site serves itself is one it licensed, and the strongest
  // signal that the look depends on a face we cannot legally or practically use
  const custom = ranked.filter(
    (f) => !google.some((g) => g.toLowerCase() === f.toLowerCase())
  )

  const substituted = []
  const resolve = (family) => {
    if (!family) return undefined
    const alt = googleAlternative(family, google)
    if (alt) substituted.push({ found: family, using: alt })
    return alt ?? family
  }

  // body is what most of the page is set in; primary is the next distinct
  // family, which on most sites is the display face used for headings
  const [first, second, third] = ranked
  const fonts = {
    primary: resolve(second ?? first),
    emphasis: resolve(third ?? second ?? first),
    body: resolve(first),
  }

  const ogImage = metaContent(html, 'property=["\']og:image["\']')
  const favicon = /<link[^>]+rel=["'][^"']*icon[^"']*["'][^>]*>/i.exec(html)?.[0]
  const faviconHref = favicon ? /href\s*=\s*["']([^"']+)["']/i.exec(favicon)?.[1] : null

  return {
    seeds,
    fonts,
    /** Families the site loads from Google — usable exactly as found. */
    googleFamilies: google,
    /** Families the site serves itself. These are the ones needing a stand-in. */
    selfHostedFamilies: selfHosted,
    customFamilies: custom,
    /** Each { found, using } pair, so the studio can say what it swapped. */
    substituted,
    preview: {
      ogImage: ogImage ? absolute(ogImage, url) : null,
      favicon: faviconHref ? absolute(faviconHref, url) : null,
    },
  }
}
