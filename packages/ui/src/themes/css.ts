// themeToCss: one theme in, one CSS block out. The app uses it for the nine
// presets and the Themer uses it for the file someone downloads, so what is
// downloaded is what the app renders.

import { oklch } from "./color"
import type { Elevation, Radius, Theme } from "./types"

const SANS = "ui-sans-serif, system-ui, sans-serif"
const SERIF = "ui-serif, Georgia, serif"

const EDGES: Record<Radius, { radius: string; container: string }> = {
  sharp: { radius: "0", container: "0" },
  subtle: { radius: "0.5rem", container: "0.75rem" },
  strong: { radius: "1rem", container: "1.5rem" },
  rounded: { radius: "1.5rem", container: "2rem" },
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

/** Glass material: heavy blur, dark tint, on cards. Refraction stays off. */
const GLASS = [
  `--glass-card-layer: "";`,
  `--glass-card-blur: 64px;`,
  `--glass-card-saturate: 180%;`,
  `--glass-card-surface: color-mix(in oklab, color-mix(in oklab, var(--card) 90%, oklch(0 0 0)) 55%, transparent);`,
]

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
  for (const level of ["h1", "h2", "h3", "h4", "h5", "h6"]) set(`${level}-weight`, String(fonts.display.weight))

  set("background", oklch(p.background))
  set("foreground", oklch(p.foreground))
  set("card", "var(--background)")
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
  p.charts.forEach((hex, i) => set(`chart-${i + 1}`, oklch(hex)))

  set("gradient-downlight", "linear-gradient(180deg, var(--background) 0%, var(--card) 50%, var(--border) 100%)")
  set("gradient-rise", "linear-gradient(180deg, var(--card) 0%, var(--secondary) 100%)")
  set("gradient-set", "linear-gradient(180deg, var(--background) 0%, var(--card) 100%)")
  set("gradient-headline", "linear-gradient(180deg, var(--foreground) 0%, var(--primary) 100%)")

  set("radius", edge.radius)
  set("radius-container", edge.container)
  for (const side of ["", "-foreground", "-primary", "-primary-foreground", "-accent", "-accent-foreground", "-border", "-ring"]) {
    const target = side === "" ? "background" : side === "-foreground" ? "foreground" : side.slice(1)
    set(`sidebar${side}`, `var(--${target})`)
  }
  for (const [name, value] of Object.entries(shadowTokens(theme.elevation))) set(name, value)

  // Settings the stylesheet carries for the AI and for components that read
  // them. Components do not read these yet.
  set("theme-spacing", theme.spacing)
  set("theme-motion", theme.motion)
  set("theme-material", theme.material)
  set("theme-elevation", theme.elevation)

  // The default theme is also `:root`, so a theme that is not glass has to say
  // so, or it inherits the default's glass.
  lines.push(...(theme.material === "glass" ? GLASS : GLASS_OFF))
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
