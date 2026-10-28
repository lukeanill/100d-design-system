// themeToCss: one theme in, one CSS block out. The app uses it for the nine
// presets and the Themer uses it for the file someone downloads, so what is
// downloaded is what the app renders.

import { oklch } from "./color"
import { MOTION_STYLES, TRANSITION_SPEEDS, cubicBezier, springEasing } from "./motion"
import type { Elevation, Radius, Scale, Theme, Tone } from "./types"

/** What each step multiplies heading and body sizes by. Medium leaves them as shipped. */
export const SCALE_FACTOR: Record<Scale, number> = { sm: 0.875, md: 1, lg: 1.125 }

/** Tailwind's own text-xs…text-xl sizes, which the scale moves along with the design system's. */
const TEXT_SIZES: Record<string, string> = { xs: "0.75rem", sm: "0.875rem", base: "1rem", lg: "1.125rem", xl: "1.25rem" }

const SANS = "ui-sans-serif, system-ui, sans-serif"
const SERIF = "ui-serif, Georgia, serif"

// `inner` is the Figma edges/button step (4 on subtle, 8 on strong, 0 on sharp, `dimensions/max` on rounded): what an element inside a
// padded component wears. The component's own corner is that plus its padding, up to `outerMax`: square on sharp, a pill on rounded.
const EDGES: Record<Radius, { radius: string; container: string; inner: string; outerMax: string; sm: string; xs: string; md: string }> = {
  sharp: { radius: "0", container: "0", inner: "0", outerMax: "0", sm: "0", xs: "0", md: "0" },
  subtle: { radius: "0.5rem", container: "0.75rem", inner: "0.25rem", outerMax: "0.5rem", sm: "0.25rem", xs: "0.125rem", md: "0.5rem" },
  strong: { radius: "1rem", container: "1.5rem", inner: "0.5rem", outerMax: "1rem", sm: "0.5rem", xs: "0.25rem", md: "1rem" },
  rounded: { radius: "1.5rem", container: "2rem", inner: "var(--dimensions-max)", outerMax: "var(--dimensions-max)", sm: "1rem", xs: "0.5rem", md: "1.5rem" },
}

type Layer = [x: number, y: number, blur: number, color: string]
const SHADOWS: Record<Exclude<Elevation, "none">, Record<"xs" | "sm" | "md" | "lg", Layer>> = {
  subtle: {
    xs: [0, 2, 4, "rgb(68 68 68 / 6%)"],
    sm: [0, 4, 8, "rgb(68 68 68 / 6%)"],
    md: [0, 8, 16, "rgb(68 68 68 / 6%)"],
    lg: [0, 16, 24, "rgb(68 68 68 / 8%)"],
  },
  strong: {
    xs: [5, 5, 10, "rgb(34 34 34 / 8%)"],
    sm: [10, 10, 20, "rgb(34 34 34 / 12%)"],
    md: [20, 20, 40, "rgb(34 34 34 / 16%)"],
    lg: [30, 30, 60, "rgb(34 34 34 / 24%)"],
  },
}

const layer = ([x, y, b, c]: Layer) => `${x}px ${y}px ${b}px ${c}`

function shadowTokens(level: Elevation): Record<string, string> {
  const names = ["shadow-2xs", "shadow-xs", "shadow-sm", "shadow", "shadow-md", "shadow-lg", "shadow-xl", "shadow-2xl"]
  if (level === "none") return Object.fromEntries(names.map((n) => [n, "none"]))
  const s = SHADOWS[level]
  return {
    "shadow-2xs": layer(s.xs), "shadow-xs": layer(s.xs), "shadow-sm": layer(s.sm), shadow: layer(s.sm),
    "shadow-md": layer(s.md), "shadow-lg": layer(s.lg), "shadow-xl": layer(s.lg), "shadow-2xl": layer(s.lg),
  }
}

/** Glass material: heavy blur, a dark or light tint, on cards. Refraction stays off. */
const glass = (tone: Tone = "dark") => [
  `--glass-card-layer: "";`,
  `--glass-card-blur: 64px;`,
  `--glass-card-saturate: 180%;`,
  `--glass-card-surface: color-mix(in oklab, color-mix(in oklab, var(--card) 90%, ${tone === "light" ? "oklch(1 0 0)" : "oklch(0 0 0)"}) 55%, transparent);`,
]

/**
 * What a card is made of, from the theme's tone (the Figma's Settings/color): solid is the background
 * 20% toward white or black, and gradient runs 10% to 20% (the card colour is the middle, and
 * `--card-image` is the gradient, which `.bg-card` paints). Glass keeps the card the background and
 * takes its tint from the tone.
 */
function cardTokens(theme: Theme): string[] {
  const { tone, material } = theme
  const toward = tone === "light" ? "white" : "black"
  const mix = (pct: number) => `color-mix(in oklab, var(--background), ${toward} ${pct}%)`
  if (material === "glass") return ["--card: var(--background);", "--card-image: none;"]
  if (material === "gradient") return [`--card: ${mix(15)};`, `--card-image: linear-gradient(180deg, ${mix(10)}, ${mix(20)});`]
  return [`--card: ${mix(20)};`, "--card-image: none;"]
}

/** The Figma `alpha` colours: a dark and a light wash, each from xs to xl. */
const ALPHA: Record<"dark" | "light", { base: string; steps: Record<string, number> }> = {
  dark: { base: "#1e1e1e", steps: { none: 0, xs: 4, sm: 8, md: 16, lg: 32, xl: 80 } },
  light: { base: "#f6f4f4", steps: { xs: 6, sm: 12, md: 24, lg: 48, xl: 96 } },
}

/**
 * The fill behind a control (tabs, prompt bar, buttons), from the theme's texture and colour:
 * solid is the card colour under a wash (the dark wash sm, the light wash md); gradient runs the md wash to the lg wash; glass has no
 * fill of its own, because the glass layer is the surface.
 */
function controlFill(theme: Theme): string {
  const tone = theme.tone === "light" ? "light" : "dark"
  if (theme.material === "glass") return "transparent"
  if (theme.material === "gradient") return `linear-gradient(180deg, var(--alpha-${tone}-md), var(--alpha-${tone}-lg))`
  const wash = tone === "dark" ? "sm" : "md"
  return `linear-gradient(var(--alpha-${tone}-${wash}), var(--alpha-${tone}-${wash})), var(--card)`
}

const GLASS_OFF = [
  "--glass-card-layer: none;",
  "--glass-card-blur: 0px;",
  "--glass-card-saturate: 100%;",
  "--glass-card-surface: initial;",
]

const stack = (family: string, fallback: string) => `'${family}', ${fallback}`

/** The custom properties of a theme, in the order they are written. */
export function themeDeclarations(theme: Theme): string[] {
  const { palette: p, fonts, scheme } = theme
  const dark = scheme === "dark"
  const edge = EDGES[theme.radius]
  const lines: string[] = [`color-scheme: ${scheme};`]
  const set = (name: string, value: string) => lines.push(`--${name}: ${value};`)

  set("font-primary", stack(fonts.display.family, SANS))
  set("font-emphasis", stack(fonts.serif.family, SERIF))
  set("font-body-token", stack(fonts.body.family, SANS))
  set("font-body-weight", String(fonts.body.weight))
  // Figma Font/Sans/line-height and letter-spacing: percents, written as a unitless line height and an em spacing
  set("font-body-line-height", String((fonts.body.lineHeight ?? 142) / 100))
  set("font-body-letter-spacing", `${(fonts.body.letterSpacing ?? 0) / 100}em`)
  for (const level of ["h1", "h2", "h3", "h4", "h5", "h6"]) set(`${level}-weight`, String(fonts.display.weight))
  set("type-scale", String(SCALE_FACTOR[theme.scale]))
  for (const [name, size] of Object.entries(TEXT_SIZES)) set(`text-${name}`, `calc(${size} * var(--type-scale))`)

  set("background", oklch(p.background))
  set("foreground", oklch(p.foreground))
  lines.push(...cardTokens(theme))
  set("card-foreground", "var(--foreground)")
  set("popover", "var(--background)")
  set("popover-foreground", "var(--foreground)")
  set("primary", oklch(p.primary))
  set("primary-foreground", oklch(p.primaryForeground))
  set("secondary", oklch(p.secondary))
  set("secondary-foreground", oklch(p.secondaryForeground))
  set("muted", "var(--secondary)")
  set("muted-foreground", oklch(p.foreground, 65))
  set("accent", "var(--secondary)")
  set("accent-foreground", "var(--secondary-foreground)")
  set("destructive", oklch(p.destructive))
  set("affirmative", dark ? "oklch(0.847 0.117 143.45)" : "oklch(0.548 0.150 145.00)")
  set("affirmative-foreground", dark ? "oklch(0.145 0 0)" : "oklch(1 0 0)")
  set("border", oklch(p.foreground, 15))
  set("input", oklch(p.foreground, 20))
  set("ring", oklch(p.foreground, 70))
  // Figma `alpha` collection: translucent dark and light washes, one value for every theme (it has a single mode)
  for (const [tone, { base, steps }] of Object.entries(ALPHA)) {
    for (const [step, percent] of Object.entries(steps)) set(`alpha-${tone}-${step}`, oklch(base, percent))
  }
  // the alpha blurs a popup's backdrop takes, sm step, for a narrow and a wide page (see --popup-blur)
  set("alpha-blur-320-sm", "40px")
  set("alpha-blur-1200-sm", "120px")
  set("control-fill", controlFill(theme))
  // a control's 1px outline (the Figma nav-bar's): the dark xs wash on a light theme, the light xs wash on a dark one;
  // glass has none, because the glass is the edge. And what a hover adds: the dark md wash on a light theme, the light md
  // wash on a dark one, so a hover is always a visible step away from the surface
  set("control-edge", theme.material === "glass" ? "transparent" : `var(--alpha-${scheme === "light" ? "dark" : "light"}-xs)`)
  set("control-hover", `var(--alpha-${scheme === "light" ? "dark" : "light"}-sm)`)
  p.charts.forEach((hex, i) => set(`chart-${i + 1}`, oklch(hex)))

  set("gradient-downlight", "linear-gradient(180deg, var(--background) 0%, var(--card) 50%, var(--border) 100%)")
  set("gradient-rise", "linear-gradient(180deg, var(--card) 0%, var(--secondary) 100%)")
  set("gradient-set", "linear-gradient(180deg, var(--background) 0%, var(--card) 100%)")
  set("gradient-headline", "linear-gradient(180deg, var(--foreground) 0%, var(--primary) 100%)")

  set("radius", edge.radius)
  set("radius-container", edge.container)
  // fully rounded is the Figma `dimensions/max` step: every other size in the system is a `dimensions` step too
  set("dimensions-max", "169px")
  set("radius-inner", edge.inner)
  set("radius-outer-max", edge.outerMax)
  // the Figma `edges` steps a card and the things inside it take (a controls takes `inner`, the `button` step)
  set("edges-sm", edge.sm)
  set("edges-xs", edge.xs)
  set("edges-md", edge.md)
  for (const side of ["", "-foreground", "-primary", "-primary-foreground", "-accent", "-accent-foreground", "-border", "-ring"]) {
    const target = side === "" ? "background" : side === "-foreground" ? "foreground" : side.slice(1)
    set(`sidebar${side}`, `var(--${target})`)
  }
  for (const [name, value] of Object.entries(shadowTokens(theme.elevation))) set(name, value)

  // Settings the stylesheet carries for the AI and for components that read
  // them. Components do not read these yet.
  set("theme-spacing", theme.spacing)
  set("theme-motion", theme.motion)
  set("theme-icon-style", theme.icons.style)
  set("theme-icon-weight", theme.icons.weight)
  set("theme-material", theme.material)
  set("theme-elevation", theme.elevation)
  set("theme-tone", theme.tone)

  // Component Animations: the easing and duration the choice is made of, and the spring's bounce.
  const motion = MOTION_STYLES[theme.motion]
  set("motion-ease", motion.curve ? cubicBezier(motion.curve) : "linear")
  set("motion-duration", `${motion.duration}s`)
  set("motion-spring-bounce", String(motion.spring ?? 0))
  // how long a hover takes: the Timing set's `fast` (a small thing changing in place), or `instant` where the theme's motion is none
  set("motion-fast", theme.motion === "none" ? "var(--duration-instant)" : "var(--duration-fast)")
  // the easing a CSS transition (a hover) uses: the theme's curve, or for Springy the spring sampled into a linear() easing
  set("motion-transition-ease", motion.spring ? springEasing(motion.spring, motion.duration) : motion.curve ? cubicBezier(motion.curve) : "linear")

  // The Feel page. Settings under a style that is none are written too, so every theme has the same
  // tokens; they mean nothing until the style is chosen.
  const f = theme.feel
  set("theme-transition", f.transition)
  set("theme-transition-color", f.transitionColor)
  set("theme-transition-speed", f.transitionSpeed)
  set("theme-transition-duration", `${TRANSITION_SPEEDS[f.transitionSpeed]}s`)
  set("theme-background", f.animatedBackground)
  set("theme-background-theme-colors", String(f.animatedBackgroundThemeColors))
  set("theme-background-inverse", String(f.animatedBackgroundInverse))
  set("theme-background-overlay", `${f.animatedBackgroundOverlay}%`)
  set("theme-hero-heading", f.heroHeading)
  set("theme-hero-text", f.heroText)
  set("theme-button-click", f.buttonClick)
  set("theme-link-hover", f.linkHover)

  // The default theme is also `:root`, so a theme that is not glass has to say
  // so, or it inherits the default's glass.
  lines.push(...(theme.material === "glass" ? glass(theme.tone) : GLASS_OFF))
  return lines
}

/** A block scoped to `.id`, or to `:root, .id` for the theme that is the default. */
export function themeToCss(theme: Theme, { asDefault = false }: { asDefault?: boolean } = {}) {
  const selector = asDefault ? `:root,\n.${theme.id}` : `.${theme.id}`
  return `${selector} {\n${themeDeclarations(theme).map((l) => `  ${l}`).join("\n")}\n}\n`
}

/** The Google families a theme names, for googleFontsHref. */
export const themeFamilies = (theme: Theme) => [
  { family: theme.fonts.display.family },
  { family: theme.fonts.body.family },
  { family: theme.fonts.serif.family },
]

/** The same declarations as an inline style, to scope a theme to one element. */
export function themeStyle(theme: Theme): Record<string, string> {
  const style: Record<string, string> = {}
  for (const line of themeDeclarations(theme)) {
    const at = line.indexOf(":")
    const name = line.slice(0, at).trim()
    // color-scheme is a real property; the rest are custom properties
    style[name === "color-scheme" ? "colorScheme" : name] = line.slice(at + 1).replace(/;$/, "").trim()
  }
  return style
}
