// The three per-theme settings beyond colour and fonts: surface style (glass),
// heading typography, and effects.
//
// Pure, and shared by everything that touches them — the studio's pickers, the
// save path, and the CSS generator — so a weight the studio previews is the
// weight the stylesheet gets.
//
// Two rules run through all of it:
//
//   A value is stored only when it differs from the default. A theme that has
//   chosen nothing carries no key at all, so the eleven themes that existed
//   before these settings stay byte-identical until someone actually changes
//   one, and the generated CSS gains not a line.
//
//   Anything unrecognised falls back to the default rather than throwing. The
//   hosted studio commits to the repo from a web request; a save must never
//   fail because a newer studio sent a field this build has never heard of,
//   and a value from a form must never reach a stylesheet unchecked.

/* ------------------------------------------------------------------ glass -- */

export const GLASS_STYLES = ["solid", "glass"]
export const GLASS_WEIGHTS = ["light", "medium", "heavy"]
export const GLASS_TONES = ["light", "dark"]
/** Cards are not here: glass always applies to them. These are the extras. */
export const GLASS_APPLICATIONS = ["actions", "inputs", "selects", "overlays"]

/** What each weight does to the layer behind a surface. */
export const GLASS_WEIGHT_VALUES = {
  light: { blur: "16px", saturate: "125%", surface: "85%" },
  // deliberately today's popover recipe, so medium is the identity element:
  // a theme on medium leaves the menus that were already glass unchanged
  medium: { blur: "40px", saturate: "150%", surface: "70%" },
  heavy: { blur: "64px", saturate: "180%", surface: "55%" },
}

/** What the glass is tinted toward, and by how much. */
export const GLASS_TONE_VALUES = {
  light: { tint: "oklch(1 0 0)", amount: "90%" },
  dark: { tint: "oklch(0 0 0)", amount: "90%" },
}

/* ------------------------------------------------------------- typography -- */

export const FONT_SCALES = ["current", "compact", "classic"]
export const HEADING_LEVELS = ["h1", "h2", "h3", "h4", "h5", "h6"]
export const HEADING_FONTS = ["primary", "emphasis"]
/** The weights a Google import carries — see fontImports in tokens-core.mjs. */
export const HEADING_WEIGHTS = [300, 400, 500, 700]

/**
 * Heading sizes per scale, in rem.
 *
 * `current` is what every theme rendered before the setting existed, and emits
 * nothing. The other two are whole-pixel ladders at 16px root: compact for
 * dense screens, classic for an even editorial progression.
 */
export const FONT_SCALE_SIZES = {
  current: ["6rem", "5rem", "4rem", "3rem", "2rem", "1.5rem"],
  compact: ["3.75rem", "3rem", "2.25rem", "1.75rem", "1.375rem", "1.125rem"],
  classic: ["4.75rem", "3.625rem", "2.75rem", "2.0625rem", "1.5625rem", "1.1875rem"],
}

/* ---------------------------------------------------------------- effects -- */

export const PAGE_TRANSITIONS = ["none", "fade", "blinds", "curtain", "iris"]
export const THEME_BACKGROUNDS = ["none", "smoke", "holo", "aurora", "eighties", "ascii"]
export const HEADING_GRADIENT_DEFAULTS = { from: "accent-foreground", to: "muted-foreground" }

/* ------------------------------------------------------------------ plumb -- */

const option = (value, allowed, fallback) => (allowed.includes(value) ? value : fallback)
const flag = (value) => value === true

/** A colour token name a theme actually carries, or null. */
const tokenName = (value, tokens) =>
  typeof value === "string" && /^[a-z][a-z0-9-]*$/.test(value) && (!tokens || value in tokens)
    ? value
    : null

/**
 * Settings the theme chose, or undefined when everything is at its default.
 * `undefined` is the signal to leave the key out of the stored file entirely.
 */
export function normalizeGlass(value) {
  if (!value || typeof value !== "object") return undefined
  const style = option(value.style, GLASS_STYLES, "solid")
  if (style !== "glass") return undefined
  const applications = Array.isArray(value.applications)
    ? GLASS_APPLICATIONS.filter((group) => value.applications.includes(group))
    : []
  return {
    style,
    weight: option(value.weight, GLASS_WEIGHTS, "medium"),
    tone: option(value.tone, GLASS_TONES, "light"),
    applications,
  }
}

export function normalizeTypography(value) {
  if (!value || typeof value !== "object") return undefined
  const scale = option(value.scale, FONT_SCALES, "current")
  const headings = {}
  for (const level of HEADING_LEVELS) {
    const heading = value.headings?.[level]
    if (!heading || typeof heading !== "object") continue
    const font = option(heading.font, HEADING_FONTS, "primary")
    const weight = HEADING_WEIGHTS.includes(Number(heading.weight)) ? Number(heading.weight) : 400
    // a level at the defaults is a level that was never changed
    if (font === "primary" && weight === 400) continue
    headings[level] = { font, ...(weight === 400 ? {} : { weight }) }
  }
  const settings = {
    ...(scale === "current" ? {} : { scale }),
    ...(Object.keys(headings).length ? { headings } : {}),
  }
  return Object.keys(settings).length ? settings : undefined
}

export function normalizeEffects(value, tokens) {
  if (!value || typeof value !== "object") return undefined
  const pageTransition = option(value.pageTransition, PAGE_TRANSITIONS, "none")
  const background = option(value.background, THEME_BACKGROUNDS, "none")
  const gradient = value.headingGradient
  const headingGradient = flag(gradient?.enabled)
    ? {
        enabled: true,
        from: tokenName(gradient.from, tokens) ?? HEADING_GRADIENT_DEFAULTS.from,
        to: tokenName(gradient.to, tokens) ?? HEADING_GRADIENT_DEFAULTS.to,
      }
    : undefined
  const settings = {
    ...(pageTransition === "none" ? {} : { pageTransition }),
    ...(background === "none" ? {} : { background }),
    ...(headingGradient ? { headingGradient } : {}),
  }
  return Object.keys(settings).length ? settings : undefined
}

/* ------------------------------------------------------- CSS declarations -- */

/**
 * Glass declarations for a theme's own block.
 *
 * Cards always, then whichever groups were ticked. Each group carries its own
 * blur and saturate rather than sharing one theme-wide pair, which is what lets
 * an unticked group keep the look it has today: menus and popovers have been
 * glass since before this setting existed, and a theme choosing Heavy for its
 * cards should not silently thicken them too.
 */
export function glassDeclarations(glass) {
  const settings = normalizeGlass(glass)
  if (!settings) return []
  const { blur, saturate, surface } = GLASS_WEIGHT_VALUES[settings.weight]
  const { tint, amount } = GLASS_TONE_VALUES[settings.tone]
  const base = {
    card: "--card",
    actions: "--primary",
    inputs: "--card",
    selects: "--popover",
    overlays: "--popover",
  }
  // one tick can drive more than one group: an overlay is a popover surface
  // and a dialog, which sit on different colours
  const group = {
    card: ["card"],
    actions: ["action"],
    inputs: ["input"],
    selects: ["select"],
    overlays: ["overlay", "dialog"],
  }

  const lines = []
  for (const key of ["card", ...settings.applications]) {
    for (const name of group[key]) {
    lines.push(
      // an empty string is a content value that renders; `none` in the
      // default block means no ::before box is generated at all
      `--glass-${name}-layer: "";`,
      `--glass-${name}-blur: ${blur};`,
      `--glass-${name}-saturate: ${saturate};`,
      `--glass-${name}-surface: color-mix(in oklab, color-mix(in oklab, var(${name === "dialog" ? "--background" : base[key]}) ${amount}, ${tint}) ${surface}, transparent);`
    )
    }
  }
  return lines
}

/**
 * Heading declarations: only the levels and sizes that differ from what every
 * theme rendered before, so the generated block stays as short as the choice.
 */
export function typographyDeclarations(typography) {
  const settings = normalizeTypography(typography)
  if (!settings) return []
  const lines = []
  if (settings.scale) {
    FONT_SCALE_SIZES[settings.scale].forEach((size, index) => {
      lines.push(`--${HEADING_LEVELS[index]}-size: ${size};`)
    })
  }
  for (const level of HEADING_LEVELS) {
    const heading = settings.headings?.[level]
    if (!heading) continue
    if (heading.font === "emphasis") {
      // the physical variables, not --font-heading: Tailwind collapses the
      // alias, and the [data-font-theme] blocks remap these two per pairing
      lines.push(`--${level}-family: var(--font-oranienbaum);`)
    }
    if (heading.weight) lines.push(`--${level}-weight: ${heading.weight};`)
  }
  return lines
}

/**
 * The animated H1 gradient, as properties the base rule already reads. Stops,
 * background size and duration match the GradientText primitive, so the CSS
 * and the component draw the same thing.
 */
export function headingGradientDeclarations(effects, tokens) {
  const gradient = normalizeEffects(effects, tokens)?.headingGradient
  if (!gradient) return []
  const { from, to } = gradient
  return [
    `--h1-gradient: linear-gradient(90deg, var(--${from}) 0%, var(--${to}) 20%, var(--${from}) 50%, var(--${to}) 80%, var(--${from}) 100%);`,
    `--h1-gradient-size: 700% 100%;`,
    `--h1-gradient-clip: text;`,
    `--h1-gradient-color: transparent;`,
    `--h1-gradient-animation: heading-gradient-pan 50s linear infinite;`,
  ]
}
