// themeToCss: one theme in, one CSS block out. The app uses it for the nine
// presets and the Themer uses it for the file someone downloads, so what is
// downloaded is what the app renders.

import { oklch } from "./color"
import { MOTION_STYLES, TRANSITION_SPEEDS, cubicBezier, springEasing } from "./motion"
import { BODY_LINE_HEIGHT_PERCENT, HEADING_LINE_HEIGHT_PERCENT, TAILWIND_TEXT, TYPESCALE, TYPE_STEPS, rem, tailwindLineHeight } from "./typescale"
import { UI_COLORS } from "./ui-color"
import type { ColorMode, Shadow, Radius, Theme } from "./types"

const SANS = "ui-sans-serif, system-ui, sans-serif"
const SERIF = "ui-serif, Georgia, serif"

// `button` is the Figma radius/button step (4 on subtle, 8 on strong, 0 on sharp, `dimensions/max` on rounded): what an element inside a
// padded component wears. The component's own corner is that plus its padding, up to `outerMax`: square on sharp, a pill on rounded.
const RADIUS: Record<Radius, { radius: string; lg: string; button: string; outerMax: string; sm: string; xs: string; md: string; xl: string }> = {
  sharp: { radius: "0", lg: "0", button: "0", outerMax: "0", sm: "0", xs: "0", md: "0", xl: "0" },
  subtle: { radius: "0.5rem", lg: "0.75rem", button: "0.25rem", outerMax: "0.5rem", sm: "0.25rem", xs: "0.125rem", md: "0.5rem", xl: "1rem" },
  strong: { radius: "1rem", lg: "1.5rem", button: "0.5rem", outerMax: "1rem", sm: "0.5rem", xs: "0.25rem", md: "1rem", xl: "2rem" },
  rounded: { radius: "1.5rem", lg: "2rem", button: "var(--dimensions-max)", outerMax: "var(--dimensions-max)", sm: "1rem", xs: "0.5rem", md: "1.5rem", xl: "2.5rem" },
}

type Layer = [x: number, y: number, blur: number, color: string]
const SHADOWS: Record<Exclude<Shadow, "none">, Record<"xs" | "sm" | "md" | "lg", Layer>> = {
  subtle: {
    xs: [0, 2, 4, "rgb(68 68 68 / 6%)"],
    sm: [0, 4, 8, "rgb(68 68 68 / 6%)"],
    md: [0, 8, 16, "rgb(68 68 68 / 6%)"],
    lg: [0, 16, 24, "rgb(68 68 68 / 8%)"],
  },
  strong: {
    xs: [0, 4, 8, "rgb(34 34 34 / 8%)"],
    sm: [0, 12, 20, "rgb(34 34 34 / 12%)"],
    md: [0, 20, 40, "rgb(34 34 34 / 16%)"],
    lg: [0, 40, 80, "rgb(34 34 34 / 24%)"],
  },
}

const layer = ([x, y, b, c]: Layer) => `${x}px ${y}px ${b}px ${c}`

function shadowTokens(level: Shadow): Record<string, string> {
  const names = ["shadow-2xs", "shadow-xs", "shadow-sm", "shadow", "shadow-md", "shadow-lg", "shadow-xl", "shadow-2xl"]
  if (level === "none") return Object.fromEntries(names.map((n) => [n, "none"]))
  const s = SHADOWS[level]
  return {
    "shadow-2xs": layer(s.xs), "shadow-xs": layer(s.xs), "shadow-sm": layer(s.sm), shadow: layer(s.sm),
    "shadow-md": layer(s.md), "shadow-lg": layer(s.lg), "shadow-xl": layer(s.lg), "shadow-2xl": layer(s.lg),
  }
}

/**
 * The Heavy glass weight (the Figma `glass/heavy`), as the refraction runtime reads it. These are the numbers in
 * LiquidGlass's heavy weight; themes.test.ts holds the two together. `edge` scales the highlight, as it does there.
 */
const HEAVY = { blur: 14, bezel: 28, thickness: 40, scale: 1, specular: 0.5, fallbackBlur: 40 }
const GLASS_EDGE = 0.6

/** The Figma `font/body/emphasis/weight` of every theme that does not set its own. */
const BODY_EMPHASIS_WEIGHT = 600

/** The popup groups: menus, selects, popovers, sheets and drawers. */
const POPUPS = ["select", "overlay"] as const

/**
 * Glass material: heavy blur, a dark or light tint, on cards. Menus, selects, popovers and sheets are plain Heavy
 * glass: refraction on, no tint fill, the theme foreground for text, and the glass's own soft shadow and inner glow
 * in place of a border and a drop shadow. Cards stay on the blur.
 */
const glass = (colorMode: ColorMode = "dark") => [
  `--glass-card-layer: "";`,
  `--glass-card-blur: 64px;`,
  `--glass-card-saturate: 180%;`,
  `--glass-card-surface: color-mix(in oklab, color-mix(in oklab, var(--card) 90%, ${colorMode === "light" ? "oklch(1 0 0)" : "oklch(0 0 0)"}) 55%, transparent);`,
  ...POPUPS.flatMap((group) => [
    `--glass-${group}-surface: transparent;`,
    `--glass-${group}-blur: ${HEAVY.fallbackBlur}px;`,
    `--glass-${group}-saturate: 100%;`,
    `--glass-${group}-refraction: 1;`,
    `--glass-${group}-refraction-blur: ${HEAVY.blur};`,
    `--glass-${group}-refraction-bezel: ${HEAVY.bezel};`,
    `--glass-${group}-refraction-thickness: ${HEAVY.thickness};`,
    `--glass-${group}-refraction-scale: ${HEAVY.scale};`,
    `--glass-${group}-refraction-specular: ${HEAVY.specular * GLASS_EDGE};`,
  ]),
  `--glass-popup-border: transparent;`,
  `--glass-popup-color: var(--foreground);`,
  `--glass-popup-shadow: 0 4px 24px rgb(0 0 0 / 18%), inset 0 0 20px -5px rgb(255 255 255 / ${Math.round(0.45 * GLASS_EDGE * 100)}%);`,
]

/**
 * What a card is made of. A card has no Figma variable: it comes from the theme's texture setting (the Figma's
 * settings/texture, `material` here) and its color-mode (settings/color-mode). Solid is the background
 * 20% toward white or black, and gradient runs 10% to 20% (the card colour is the middle, and
 * `--card-image` is the gradient, which `.bg-card` paints). Glass keeps the card the background and
 * takes its tint from the color-mode.
 */
function cardTokens(theme: Theme): string[] {
  const { colorMode, material } = theme
  const toward = colorMode === "light" ? "white" : "black"
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
  const tone = theme.colorMode
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
  // popups on a solid theme keep the tinted blur, border and shadow they have always had
  ...POPUPS.flatMap((group) => [
    `--glass-${group}-surface: initial;`,
    `--glass-${group}-blur: 40px;`,
    `--glass-${group}-saturate: 150%;`,
    `--glass-${group}-refraction: 0;`,
    ...["blur", "bezel", "thickness", "scale", "specular"].map((n) => `--glass-${group}-refraction-${n}: initial;`),
  ]),
  "--glass-popup-border: initial;",
  "--glass-popup-color: initial;",
  "--glass-popup-shadow: initial;",
]

const stack = (family: string, fallback: string) => `'${family}', ${fallback}`

/** The custom properties of a theme, in the order they are written. */
export function themeDeclarations(theme: Theme): string[] {
  const { palette: p, fonts, colorMode } = theme
  const step = RADIUS[theme.radius]
  const lines: string[] = [`color-scheme: ${colorMode};`]
  const set = (name: string, value: string) => lines.push(`--${name}: ${value};`)

  set("font-primary", stack(fonts.display.family, SANS))
  set("font-body-token", stack(fonts.body.family, SANS))
  set("font-body-weight", String(fonts.body.weight))
  // the Figma font/primary, font/secondary and font/body/action weights: the text classes and the buttons read these
  set("font-body-weight-action", String(fonts.body.actionWeight ?? fonts.body.weight))
  // the Figma font/body/emphasis/weight: bold body text. Every theme but Fabrik (400) uses 600
  set("font-body-weight-emphasis", String(fonts.body.emphasis ?? BODY_EMPHASIS_WEIGHT))
  set("font-primary-weight-regular", String(fonts.display.weight))
  set("font-primary-weight-emphasis", String(fonts.display.emphasis ?? fonts.display.weight))
  set("font-primary-letter-spacing", `${(fonts.display.letterSpacing ?? 0) / 100}em`)
  set("font-secondary", stack(fonts.secondary.family, SERIF))
  set("font-secondary-style", fonts.secondary.italic ? "italic" : "normal")
  set("font-secondary-weight-regular", String(fonts.secondary.weight))
  set("font-secondary-weight-emphasis", String(fonts.secondary.emphasis ?? fonts.secondary.weight))
  set("font-secondary-letter-spacing", `${(fonts.secondary.letterSpacing ?? 0) / 100}em`)
  // Figma Font/Sans/line-height and letter-spacing: percents, written as a unitless line height and an em spacing
  // line-height per font role, as a unitless ratio: the text styles, headings, body and Tailwind text sizes all read these
  set("font-body-line-height", String((fonts.body.lineHeight ?? BODY_LINE_HEIGHT_PERCENT) / 100))
  set("font-primary-line-height", String((fonts.display.lineHeight ?? HEADING_LINE_HEIGHT_PERCENT) / 100))
  set("font-secondary-line-height", String((fonts.secondary.lineHeight ?? HEADING_LINE_HEIGHT_PERCENT) / 100))
  set("font-body-letter-spacing", `${(fonts.body.letterSpacing ?? 0) / 100}em`)
  for (const level of ["h1", "h2", "h3", "h4", "h5", "h6"]) set(`${level}-weight`, String(fonts.display.weight))
  // the Figma typescale mode this theme uses (settings/typescale): every size written out, no multiplier
  for (const step of TYPE_STEPS) set(`typescale-${step}`, rem(TYPESCALE[theme.scale][step]))
  for (const [name, step] of Object.entries(TAILWIND_TEXT)) {
    set(`text-${name}`, `var(--typescale-${step})`)
    set(`text-${name}--line-height`, tailwindLineHeight(name))
  }
  for (const n of [1, 2, 3, 4, 5, 6]) set(`h${n}-size`, `var(--typescale-h${n})`)

  set("background", oklch(p.background))
  set("foreground", oklch(p.foreground))
  lines.push(...cardTokens(theme))
  set("card-foreground", "var(--foreground)")
  set("popover", p.popover ? oklch(p.popover) : "var(--background)")
  set("popover-foreground", p.popoverForeground ? oklch(p.popoverForeground) : "var(--foreground)")
  set("primary", oklch(p.primary))
  set("primary-foreground", oklch(p.primaryForeground))
  set("secondary", oklch(p.secondary))
  set("secondary-foreground", oklch(p.secondaryForeground))
  set("muted", "var(--secondary)")
  set("muted-foreground", p.mutedForeground ? oklch(p.mutedForeground) : oklch(p.foreground, 65))
  set("accent", p.accent ? oklch(p.accent) : "var(--secondary)")
  set("accent-foreground", p.accentForeground ? oklch(p.accentForeground) : "var(--secondary-foreground)")
  // the Figma primitives color-700 and color-800 (nothing reads them yet)
  set("primitive-700", oklch(p.color700))
  set("primitive-800", oklch(p.color800))
  // the Figma ui-color collection, in the mode this theme's `ui-color` setting names
  const ui = UI_COLORS[theme.uiColor]
  set("destructive", oklch(ui.destructive))
  set("affirmative", oklch(ui.affirmative))
  set("focus", oklch(ui.focus))
  set("affirmative-foreground", "var(--foreground)")
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
  set("control-edge", theme.material === "glass" ? "transparent" : `var(--alpha-${colorMode === "light" ? "dark" : "light"}-xs)`)
  set("control-hover", `var(--alpha-${colorMode === "light" ? "dark" : "light"}-sm)`)
  ui.charts.forEach((hex, i) => set(`chart-${i + 1}`, oklch(hex)))

  set("gradient-downlight", "linear-gradient(180deg, var(--background) 0%, var(--card) 50%, var(--border) 100%)")
  set("gradient-rise", "linear-gradient(180deg, var(--card) 0%, var(--secondary) 100%)")
  set("gradient-set", "linear-gradient(180deg, var(--background) 0%, var(--card) 100%)")
  set("gradient-headline", "linear-gradient(180deg, var(--foreground) 0%, var(--primary) 100%)")

  set("radius", step.radius)
  set("radius-lg", step.lg)
  // fully rounded is the Figma `dimensions/max` step: every other size in the system is a `dimensions` step too
  set("dimensions-max", "9999px")
  set("radius-button", step.button)
  set("radius-outer-max", step.outerMax)
  // the Figma `radius` steps a card and the things inside it take (a control takes `button`)
  set("radius-sm", step.sm)
  set("radius-xs", step.xs)
  set("radius-md", step.md)
  set("radius-xl", step.xl)
  for (const side of ["", "-foreground", "-primary", "-primary-foreground", "-accent", "-accent-foreground", "-border", "-ring"]) {
    const target = side === "" ? "background" : side === "-foreground" ? "foreground" : side.slice(1)
    set(`sidebar${side}`, `var(--${target})`)
  }
  for (const [name, value] of Object.entries(shadowTokens(theme.shadow))) set(name, value)

  // Settings the stylesheet carries for the AI and for components that read
  // them. Components do not read these yet.
  set("theme-spacing", theme.spacing)
  set("theme-motion", theme.motion)
  set("theme-ui-color", theme.uiColor)
  set("theme-icon-style", theme.icons.style)
  set("theme-icon-weight", theme.icons.weight)
  set("theme-material", theme.material)
  set("theme-shadow", theme.shadow)
  set("theme-color-mode", theme.colorMode)

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
  lines.push(...(theme.material === "glass" ? glass(theme.colorMode) : GLASS_OFF))
  return lines
}

/**
 * A block scoped to `.id`, or to `:where(:root), .id` for the theme that is the default. `:where` gives the
 * `:root` half no specificity: written as a plain `:root` it ties with a theme's class, and the default's
 * block (written after the themes before it) would win on <html> and paint those themes as the default.
 */
export function themeToCss(theme: Theme, { asDefault = false }: { asDefault?: boolean } = {}) {
  const selector = asDefault ? `:where(:root),\n.${theme.id}` : `.${theme.id}`
  return `${selector} {\n${themeDeclarations(theme).map((l) => `  ${l}`).join("\n")}\n}\n`
}

/** The Google families a theme names, for googleFontsHref. */
export const themeFamilies = (theme: Theme) => [
  { family: theme.fonts.display.family },
  { family: theme.fonts.body.family },
  { family: theme.fonts.secondary.family },
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
