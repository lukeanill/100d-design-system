// Color maths shared by the theme studio, the CSS generator and the CI gate,
// so the contrast a theme previews at is the contrast CI enforces.

const cbrt = Math.cbrt

export function parseOklch(value) {
  const m = /oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/.exec(value)
  return m ? { L: +m[1], C: +m[2], H: +m[3] } : null
}

export function oklchToRgb({ L, C, H }) {
  const h = (H * Math.PI) / 180
  const a = C * Math.cos(h)
  const b = C * Math.sin(h)
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  const lin = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ]
  return lin.map((x) => {
    const c = Math.max(0, Math.min(1, x))
    const enc = c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055
    return Math.max(0, Math.min(1, enc))
  })
}

export function rgbToOklch([r, g, b]) {
  const f = (x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4)
  ;[r, g, b] = [f(r), f(g), f(b)]
  const l = cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  const C = Math.hypot(A, B)
  const H = C < 1e-6 ? 0 : ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360
  return { L, C, H }
}

export function hexToOklch(hex) {
  const h = hex.replace("#", "").trim()
  const full = h.length === 3 ? [...h].map((c) => c + c).join("") : h
  return rgbToOklch([0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255))
}

export const oklchToHex = (c) =>
  "#" + oklchToRgb(c).map((v) => Math.round(v * 255).toString(16).padStart(2, "0")).join("")

export const fmt = ({ L, C, H }) => `oklch(${L.toFixed(3)} ${C.toFixed(3)} ${H.toFixed(2)})`

export function luminance(rgb) {
  const f = (x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4)
  const [r, g, b] = rgb.map(f)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrast(a, b) {
  const la = luminance(oklchToRgb(a))
  const lb = luminance(oklchToRgb(b))
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

/** Nudge L (keeping hue and chroma) until `color` clears `target` on `bg`. */
export function ensureContrast(color, bg, target = 4.5) {
  if (contrast(color, bg) >= target) return color
  const goDark = luminance(oklchToRgb(bg)) > 0.4
  let lo = goDark ? 0 : color.L
  let hi = goDark ? color.L : 1
  let best = { ...color, L: goDark ? 0 : 1 }
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2
    const candidate = { ...color, L: mid }
    if (contrast(candidate, bg) >= target) {
      best = candidate
      if (goDark) lo = mid
      else hi = mid
    } else if (goDark) hi = mid
    else lo = mid
  }
  return best
}

/** The readable ink for a filled surface: whichever end of the scale wins. */
export const onColor = (bg) => {
  const light = { L: 1, C: 0, H: 0 }
  const dark = { L: 0.145, C: 0, H: 0 }
  return contrast(light, bg) >= contrast(dark, bg) ? light : dark
}

const mix = (a, b, t) => ({
  L: a.L + (b.L - a.L) * t,
  C: a.C + (b.C - a.C) * t,
  H: a.H,
})

/** The four edge presets the studio offers, in the order the designs show them. */
export const EDGES = {
  square: "0",
  subtle: "0.5rem",
  strong: "1rem",
  round: "9999px",
}

/** Nearest preset for an existing radius, or "custom" when it matches none. */
export const edgesFor = (radius) =>
  Object.entries(EDGES).find(([, value]) => value === String(radius).trim())?.[0] ?? "custom"

/**
 * Builds a full theme from four seeds. Every foreground is solved against the
 * surface it actually sits on, so a derived theme cannot ship below 4.5:1.
 *
 * `secondary` is a seed rather than a tint of primary: the designs let you set
 * it directly. Omit it and it falls back to the old derived tint.
 *
 * `overrides` are tokens a person set by hand in the studio. They are applied
 * last and deliberately escape the contrast solver — `checkContrast` will
 * report them instead of silently correcting them.
 */
export function derivePalette({
  background,
  foreground,
  primary,
  secondary: secondarySeed,
  edges,
  radius = "0.875rem",
  overrides = {},
}) {
  const bg = typeof background === "string" ? hexToOklch(background) : background
  const fg = typeof foreground === "string" ? hexToOklch(foreground) : foreground
  const pr = typeof primary === "string" ? hexToOklch(primary) : primary
  const isLight = luminance(oklchToRgb(bg)) > 0.4

  const card = { ...bg, L: isLight ? Math.min(1, bg.L + 0.012) : Math.min(1, bg.L + 0.05), C: bg.C * 0.5 }
  const muted = mix(bg, fg, isLight ? 0.06 : 0.1)
  const mutedFg = ensureContrast(mix(fg, bg, 0.35), card, 4.6)
  const secondary = secondarySeed
    ? typeof secondarySeed === "string"
      ? hexToOklch(secondarySeed)
      : secondarySeed
    : { ...mix(bg, pr, isLight ? 0.12 : 0.2), C: Math.min(pr.C, 0.06) }
  const secondaryFg = ensureContrast({ ...pr, L: pr.L }, secondary, 4.5)
  const destructive = ensureContrast({ L: 0.62, C: 0.19, H: 25 }, bg, 4.5)
  const affirmative = ensureContrast({ L: 0.62, C: 0.15, H: 145 }, bg, 4.5)
  const charts = [0, 40, 80, 200, 320].map((offset, i) => ({
    L: isLight ? 0.68 + i * 0.03 : 0.62 + i * 0.04,
    C: Math.max(0.04, Math.min(0.12, pr.C || 0.08)),
    H: (pr.H + offset) % 360,
  }))

  return {
    "font-body-weight": "400",
    background: fmt(bg),
    foreground: fmt(fg),
    card: fmt(card),
    "card-foreground": fmt(ensureContrast(fg, card, 4.5)),
    popover: fmt(card),
    "popover-foreground": fmt(ensureContrast(fg, card, 4.5)),
    primary: fmt(pr),
    "primary-foreground": fmt(onColor(pr)),
    secondary: fmt(secondary),
    "secondary-foreground": fmt(secondaryFg),
    muted: fmt(muted),
    "muted-foreground": fmt(mutedFg),
    accent: fmt(secondary),
    "accent-foreground": fmt(secondaryFg),
    destructive: fmt(destructive),
    affirmative: fmt(affirmative),
    border: "var(--muted)",
    input: "var(--card)",
    ring: "var(--accent)",
    "affirmative-foreground": fmt(onColor(affirmative)),
    "chart-1": fmt(charts[0]),
    "chart-2": fmt(charts[1]),
    "chart-3": fmt(charts[2]),
    "chart-4": fmt(charts[3]),
    "chart-5": fmt(charts[4]),
    "gradient-downlight":
      "linear-gradient(180deg, var(--background) 0%, var(--card) 50%, var(--border) 100%)",
    "gradient-rise": "linear-gradient(180deg, var(--card) 0%, var(--secondary) 100%)",
    "gradient-set": "linear-gradient(180deg, var(--background) 0%, var(--card) 100%)",
    "gradient-headline": "linear-gradient(180deg, var(--foreground) 0%, var(--primary) 100%)",
    radius: edges ? (EDGES[edges] ?? radius) : radius,
    sidebar: "var(--card)",
    "sidebar-foreground": "var(--foreground)",
    "sidebar-primary": "var(--primary)",
    "sidebar-primary-foreground": "var(--primary-foreground)",
    "sidebar-accent": "var(--accent)",
    "sidebar-accent-foreground": "var(--accent-foreground)",
    "sidebar-border": "var(--border)",
    "sidebar-ring": "var(--ring)",
    "shadow-2xs": "0px 1px 1px oklch(0 0 0 / 4%)",
    "shadow-xs": "0px 1px 2px oklch(0 0 0 / 4%)",
    "shadow-sm": "0px 2px 2px oklch(0 0 0 / 4%)",
    shadow: "0px 2px 2px oklch(0 0 0 / 4%)",
    "shadow-md": "0px 2px 2px oklch(0 0 0 / 4%), 0px 8px 8px -8px oklch(0 0 0 / 4%)",
    "shadow-lg": "0px 2px 2px oklch(0 0 0 / 4%), 0px 8px 16px -4px oklch(0 0 0 / 4%)",
    "shadow-xl":
      "0px 1px 1px oklch(0 0 0 / 2%), 0px 4px 8px -4px oklch(0 0 0 / 4%), 0px 16px 24px -8px oklch(0 0 0 / 6%)",
    "shadow-2xl":
      "0px 1px 1px oklch(0 0 0 / 2%), 0px 8px 16px -4px oklch(0 0 0 / 4%), 0px 24px 32px -8px oklch(0 0 0 / 6%)",
    ...Object.fromEntries(
      Object.entries(overrides).map(([token, value]) => [
        token,
        /^#|^[0-9a-fA-F]{6}$/.test(String(value).trim()) ? fmt(hexToOklch(value)) : value,
      ])
    ),
  }
}

/** The twelve derived tokens the studio shows as editable swatches. */
export const DERIVED_SWATCHES = [
  { token: "primary-foreground", label: "On Primary" },
  { token: "secondary-foreground", label: "On Secondary" },
  { token: "border", label: "Border" },
  { token: "input", label: "Input" },
  { token: "card", label: "Card" },
  { token: "card-foreground", label: "On Foreground" },
  { token: "muted", label: "Muted" },
  { token: "muted-foreground", label: "On Muted" },
  { token: "accent", label: "Accent" },
  { token: "accent-foreground", label: "On Accent" },
  { token: "destructive", label: "Destructive" },
  { token: "affirmative", label: "Affirmative" },
]

/** Pairs that must stay legible; the studio and CI both read this list. */
export const CONTRAST_RULES = [
  { fg: "foreground", bg: "background", min: 4.5, label: "body text" },
  { fg: "card-foreground", bg: "card", min: 4.5, label: "card text" },
  { fg: "muted-foreground", bg: "card", min: 4.5, label: "muted text" },
  { fg: "primary-foreground", bg: "primary", min: 4.5, label: "text on primary" },
  { fg: "secondary-foreground", bg: "secondary", min: 4.5, label: "text on secondary" },
  { fg: "accent-foreground", bg: "accent", min: 4.5, label: "text on accent" },
  { fg: "affirmative-foreground", bg: "affirmative", min: 4.5, label: "text on affirmative" },
  { fg: "destructive", bg: "background", min: 3, label: "destructive on background" },
]

/** Resolves a token value to oklch, following one level of var() aliasing. */
export function resolve(tokens, name, seen = new Set()) {
  const raw = tokens[name]
  if (!raw || seen.has(name)) return null
  seen.add(name)
  const alias = /^var\(--([\w-]+)\)$/.exec(raw.trim())
  if (alias) return resolve(tokens, alias[1], seen)
  return parseOklch(raw)
}

export function checkContrast(tokens) {
  const results = []
  for (const rule of CONTRAST_RULES) {
    const fg = resolve(tokens, rule.fg)
    const bg = resolve(tokens, rule.bg)
    if (!fg || !bg) continue
    const ratio = contrast(fg, bg)
    results.push({ ...rule, ratio: Math.round(ratio * 100) / 100, pass: ratio >= rule.min })
  }
  return results
}
