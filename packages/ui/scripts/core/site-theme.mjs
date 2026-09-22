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

import { contrast, hexToOklch, rgbToOklch } from "../../tokens/lib/color.mjs"

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

/**
 * Colours a site names as custom properties, repeated so they count for more.
 *
 * A colour someone bothered to name (`--hm-orange`, `--brand-primary`) is part
 * of the design; one written once inline is usually an accident of a component.
 * A name that says what the colour is for counts for more again.
 */
export function namedColorsIn(css) {
  const out = []
  for (const [, name, value] of css.matchAll(/(--[\w-]+)\s*:\s*([^;}]+)/g)) {
    const found = colorsIn(value)
    if (found.length !== 1) continue
    const weight = /brand|primary|accent|main|key|highlight/i.test(name) ? 8 : 3
    for (let i = 0; i < weight; i++) out.push(found[0])
  }
  return out
}

const describe = (hex) => {
  try {
    const { L, C, H } = hexToOklch(hex)
    return { hex, L, C, H }
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
 * The colours the page itself is painted in: the background and text colour
 * set on <html>, <body> or the classes and ids those two tags carry.
 *
 * Lightness is a poor guess at the page colour — hellomuller.com is solid
 * orange, but a framework stylesheet's `body { background: #fff }` made white
 * the "lightest" answer. The rule that actually wins on <body> is the answer.
 * Of the rules that match, the most specific wins and, between equals, the
 * later one, as in the cascade.
 */
export function pageColors(html, css) {
  const tagAttr = (tag, attr) =>
    new RegExp(`<${tag}\\b[^>]*\\b${attr}\\s*=\\s*["']([^"']+)["']`, "i").exec(html)?.[1] ?? ""
  const specificity = new Map([["html", 1], ["body", 1], [":root", 1]])
  for (const tag of ["html", "body"]) {
    for (const cls of tagAttr(tag, "class").split(/\s+/).filter(Boolean)) {
      specificity.set(`.${cls}`, 10).set(`${tag}.${cls}`, 11)
    }
    const id = tagAttr(tag, "id").trim()
    if (id) specificity.set(`#${id}`, 100)
  }

  const best = { background: null, foreground: null }
  const consider = (role, hex, score) => {
    if (hex && (!best[role] || score >= best[role].score)) best[role] = { hex, score }
  }
  // A scan rather than a regex: /([^{}]+)\{/ backtracks quadratically on a
  // long brace-free run, and one 950KB page held the function for minutes.
  for (const chunk of css.split("}")) {
    const open = chunk.lastIndexOf("{")
    if (open < 0) continue
    const body = chunk.slice(open + 1)
    const prelude = chunk.slice(0, open)
    // inside @media the chunk reads "@media … { .a", so take what follows it
    const selectors = prelude.slice(prelude.lastIndexOf("{") + 1)
    const score = Math.max(
      0,
      ...selectors.split(",").map((sel) => specificity.get(sel.trim()) ?? 0)
    )
    if (!score) continue
    const background = /(?:^|;|\s)background(?:-color)?\s*:\s*([^;]+)/i.exec(body)?.[1]
    const color = /(?:^|;|\s)color\s*:\s*([^;]+)/i.exec(body)?.[1]
    consider("background", background && colorsIn(background)[0], score)
    consider("foreground", color && colorsIn(color)[0], score)
  }
  return { background: best.background?.hex, foreground: best.foreground?.hex }
}

/**
 * The colours a site's CSS actually uses, most used first, each with its count.
 * Named custom properties count extra (see namedColorsIn). Tailwind's own
 * plumbing — `--tw-ring-color` and friends, set on every element whether used
 * or not — is left out, or its default blue would outrank any brand.
 */
export function cssColorRanking(html, css) {
  const clean = (text) => text.replace(/--tw-[\w-]+\s*:[^;}]*/g, "")
  const counts = new Map()
  for (const hex of [...colorsIn(clean(`${html}\n${css}`)), ...namedColorsIn(clean(css))]) {
    counts.set(hex, (counts.get(hex) ?? 0) + 1)
  }
  return [...counts]
    .map(([hex, count]) => ({ ...describe(hex), count }))
    .filter((c) => c.hex)
    .sort((a, b) => b.count - a.count)
}

/**
 * Primary and secondary from both sources. The screenshot knows what is on
 * screen; the CSS knows what the site uses beyond its first screen — the
 * accent on buttons further down, a hover, a tag. So a colour the screenshot
 * shows wins, and where it shows none (it only found the page and its ink),
 * the CSS's most used colour steps in, preferring one that is on the first
 * screen as well.
 *
 * @param seeds    the four seeds from the screenshot, already exact
 * @param ranking  cssColorRanking(html, css)
 * @param onScreen colours declared by elements on the first screen
 * @param applied  colours applied to any element on the page; when given, a
 *                 CSS colour must be one of them — declared is not enough
 */
export function mixSeeds(seeds, ranking, onScreen = [], applied = null) {
  const bg = seeds.background && describe(seeds.background)
  if (!bg) return seeds
  // Ink that is barely distinguishable from the page means the screenshot
  // caught the page before its text (a preloader, a fade-in). The colour
  // declared on screen that stands out most against the page is the ink.
  let fg = seeds.foreground && describe(seeds.foreground)
  if (!fg || contrast(fg, bg) < 1.5) {
    const ink = onScreen
      .map(describe)
      .filter(Boolean)
      .sort((a, b) => contrast(b, bg) - contrast(a, bg))[0]
    if (ink && contrast(ink, bg) >= 1.5) {
      if (seeds.primary === seeds.foreground) seeds = { ...seeds, primary: ink.hex }
      seeds = { ...seeds, foreground: ink.hex }
      fg = ink
    }
  }
  const visible = new Set(onScreen)
  const used = applied && new Set(applied)
  const distinct = (c, ...others) =>
    others.every((o) => !o || (c.hex !== o.hex && labGap(c, o) >= 0.1))
  // a colour, used on purpose (more than a stray declaration or two), and not
  // the page or its ink
  const accents = ranking
    .filter(
      (c) =>
        c.C >= 0.04 &&
        (visible.has(c.hex) || (used ? used.has(c.hex) : c.count >= 3)) &&
        distinct(c, bg, fg)
    )
    .sort((a, b) => Number(visible.has(b.hex)) - Number(visible.has(a.hex)) || b.count - a.count)

  const out = { ...seeds }
  // the ink counts as shown when it is itself a colour — POV's orange type
  const shownPrimary =
    seeds.primary && (seeds.primary !== seeds.foreground || (fg && fg.C >= 0.1))
  const primary = shownPrimary ? describe(seeds.primary) : accents[0]
  if (primary) out.primary = primary.hex

  const shownSecondary =
    seeds.secondary && seeds.secondary !== seeds.background && seeds.secondary !== seeds.foreground
  if (!shownSecondary) {
    const next = accents.find((c) => primary && distinct(c, primary))
    if (next) out.secondary = next.hex
  }
  return out
}

/** Degrees between two hues, the short way round. */
const hueGap = (a, b) => {
  const d = Math.abs((a ?? 0) - (b ?? 0)) % 360
  return d > 180 ? 360 - d : d
}

/**
 * Sort candidate colours into the four seeds the studio asks for.
 *
 * `hexes` is every colour occurrence, duplicates included — how often a colour
 * is used is the best evidence of whether it is the brand or an accident.
 * Picking by chroma alone let a one-off magenta badge, or the yellow that
 * normalize.css gives <mark>, beat an orange used on every button.
 *
 * Background and foreground are the extremes of lightness — a page is mostly
 * one and reads in the other. Primary is the most used colour that is not grey.
 * Secondary is the next one used often enough to be deliberate and far enough
 * away in hue or lightness not to be the brand twice; when a site has no second
 * colour, which is common, it falls back to the site's most used grey rather
 * than inventing one out of the noise.
 */
export function assignRoles(hexes, { themeColor, page = {} } = {}) {
  const counts = new Map()
  for (const hex of hexes) counts.set(hex, (counts.get(hex) ?? 0) + 1)

  const colors = []
  for (const [hex, count] of counts) {
    const d = describe(hex)
    if (d) colors.push({ ...d, count })
  }
  if (!colors.length) return {}

  // what <body> is painted in, when the CSS says; the extremes of lightness
  // otherwise, since a page is mostly one and reads in the other
  const known = (hex) => (hex ? (colors.find((c) => c.hex === hex) ?? describe(hex)) : null)
  const byLight = [...colors].sort((a, b) => b.L - a.L)
  const background = known(page.background) ?? byLight[0]
  const foreground = known(page.foreground) ?? byLight[byLight.length - 1]
  const rest = colors.filter((c) => c.hex !== background.hex && c.hex !== foreground.hex)
  const byUse = (a, b) => b.count - a.count || b.C - a.C

  const chromatic = rest.filter((c) => c.C >= 0.04).sort(byUse)
  // theme-color tints the browser's chrome; on dark sites that is often a
  // near-black, which says nothing about the brand, so only a colour counts
  const described = themeColor ? describe(themeColor.toLowerCase()) : null
  const themed = described && described.C >= 0.04 ? described : null
  // a brand colour is used more than a couple of times; when the site's only
  // colour is its background, the ink it sets on it is the primary instead
  const primary = themed
    ? (colors.find((c) => c.hex === themed.hex) ?? { ...themed, count: 0 })
    : (chromatic.find((c) => c.count >= 3) ?? foreground)

  const enough = Math.max(2, (primary?.count ?? 0) * 0.25)
  const secondary =
    chromatic.find(
      (c) =>
        c.hex !== primary?.hex &&
        c.count >= enough &&
        (!primary || hueGap(c.H, primary.H) >= 40 || Math.abs(c.L - primary.L) > 0.25)
    ) ?? rest.filter((c) => c.C < 0.04 && c.hex !== primary?.hex).sort(byUse)[0]

  return {
    background: background?.hex,
    foreground: foreground?.hex,
    primary: primary?.hex,
    secondary: secondary?.hex,
  }
}

/* ----------------------------------------------------------------- image -- */

/** Distance between two OKLCH colours, in OKLab. */
const labGap = (a, b) => {
  const ab = (c) => [c.C * Math.cos((c.H * Math.PI) / 180), c.C * Math.sin((c.H * Math.PI) / 180)]
  const [a1, b1] = ab(a)
  const [a2, b2] = ab(b)
  return Math.hypot(a.L - b.L, a1 - a2, b1 - b2)
}

/**
 * The colours an image is made of, largest area first, each with its share.
 *
 * Pixels are bucketed coarsely, then buckets that look alike are merged, so a
 * gradient or JPEG noise reads as one colour rather than forty near-misses.
 */
export function imageColors({ data, width, height }) {
  const total = width * height
  const step = Math.max(1, Math.floor(Math.sqrt(total / 40000)))
  const buckets = new Map()
  let sampled = 0
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const i = (y * width + x) * 4
      if (data[i + 3] < 128) continue // transparent pixels are not the page
      const key = ((data[i] >> 4) << 8) | ((data[i + 1] >> 4) << 4) | (data[i + 2] >> 4)
      const b = buckets.get(key) ?? { n: 0, r: 0, g: 0, b: 0 }
      b.n++
      b.r += data[i]
      b.g += data[i + 1]
      b.b += data[i + 2]
      buckets.set(key, b)
      sampled++
    }
  }
  if (!sampled) return []

  const clusters = []
  for (const b of [...buckets.values()].sort((x, y) => y.n - x.n)) {
    const rgb = [b.r / b.n, b.g / b.n, b.b / b.n]
    const color = rgbToOklch(rgb.map((v) => v / 255))
    const near = clusters.find((c) => labGap(c.color, color) < 0.07)
    if (near) near.n += b.n
    else clusters.push({ n: b.n, rgb, color })
  }
  return clusters
    .sort((a, b) => b.n - a.n)
    .map(({ n, rgb, color }) => ({ hex: toHex(...rgb), ...color, share: n / sampled }))
}

/**
 * Seeds read from a picture of the site, by area: what you see most of is the
 * background, the colour that stands out most against it is the ink, and the
 * biggest colour that is neither is the primary. It reflects the picture, not
 * the brand guidelines — which is the point.
 */
export function rolesFromImage(image) {
  const colors = imageColors(image).filter((c) => c.share >= 0.01)
  if (!colors.length) return {}

  const background = colors[0]
  const distinct = (c, ...others) => others.every((o) => !o || labGap(c, o) >= 0.15)

  const foreground = [...colors.slice(1)].sort(
    (a, b) => contrast(b, background) - contrast(a, background)
  )[0]
  const primary =
    // clearly a colour, and enough of it to be part of the look rather than a
    // corner of a photo; a near-black navy is ink, not a primary
    colors.find((c) => c.C >= 0.08 && c.share >= 0.02 && distinct(c, background, foreground)) ??
    foreground
  const secondary =
    colors.find(
      (c) => c.share >= 0.02 && distinct(c, background, foreground, primary === foreground ? null : primary)
    ) ?? background

  return {
    background: background.hex,
    foreground: foreground?.hex,
    primary: primary?.hex,
    secondary: secondary?.hex,
  }
}

/* ---------------------------------------------------------------- styles -- */

/**
 * Snap each seed read from pixels to the exact colour the site declares for
 * it. A flat colour survives capture almost unchanged, so the nearest declared
 * colour within a hair is the one on screen; a seed with nothing that close —
 * a colour that only exists in a photograph — keeps its sampled value.
 */
export function snapToDeclared(seeds, declared, tolerance = 14) {
  // RGB distance, not perceptual: capture noise is a few units per channel
  // wherever the colour sits, while OKLab stretches the darks — #010101 is
  // further from #000000 there than #fe4800 is from #ff4800
  const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
  const palette = [...new Set(declared)].filter((hex) => /^#[0-9a-f]{6}$/.test(hex))
  const out = {}
  for (const [role, hex] of Object.entries(seeds)) {
    if (!hex) continue
    const seed = rgb(hex)
    let best = null
    for (const candidate of palette) {
      const gap = Math.hypot(...rgb(candidate).map((v, i) => v - seed[i]))
      if (gap <= tolerance && (!best || gap < best.gap)) best = { hex: candidate, gap }
    }
    out[role] = best?.hex ?? hex
  }
  return out
}

/**
 * The families the page renders in, by role: the display face is the one set
 * largest, the body face the one covering the most text, and emphasis the
 * next family used after those. Exact names, as the site declares them.
 */
export function fontsFromStyles(styles) {
  const fonts = (styles?.fonts ?? []).filter((f) => !GENERIC.has(f.family.toLowerCase()))
  if (!fonts.length) return {}
  const body = fonts[0]
  const display = [...fonts].sort((a, b) => b.maxSize - a.maxSize)[0]
  const emphasis = fonts.find((f) => f !== body && f !== display) ?? display
  return { primary: display.family, emphasis: emphasis.family, body: body.family }
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
  const seeds = assignRoles([...colorsIn(all), ...namedColorsIn(css)], {
    themeColor: themeColor && /^#/.test(themeColor.trim()) ? themeColor.trim() : undefined,
    // the CSS only: the page's own <style> blocks are already in it, and the
    // rest of the HTML is markup, not rules
    page: pageColors(html, css),
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
