// Which Figma variable each code token comes from, and which mode of its collection the theme uses.
// One map for everything that shows the link: the /tokens page and the Storybook Tokens panel.
// A token with no entry has no Figma variable.

import type { Theme } from "./types"

export interface FigmaVariable {
  /** The Figma variable: collection, then name, for example `color/semantic/primary` or `ui-color/chart-1`. */
  variable: string
  /** The mode of its collection that the theme uses: a theme name, a ui-color mode, a typescale mode, and so on. */
  mode: string
}

const SEMANTIC_COLOURS = new Set([
  "background", "foreground", "card-foreground", "popover", "popover-foreground", "primary", "primary-foreground",
  "secondary", "secondary-foreground", "muted", "muted-foreground", "accent", "accent-foreground", "border", "input", "ring",
  "sidebar", "sidebar-foreground", "sidebar-primary", "sidebar-primary-foreground", "sidebar-accent",
  "sidebar-accent-foreground", "sidebar-border", "sidebar-ring",
])
const UI_COLOURS = new Set(["destructive", "affirmative", "focus", "chart-1", "chart-2", "chart-3", "chart-4", "chart-5"])

/** Font tokens: the CSS custom property, the Figma variable (all in the theme collection). */
const FONT_VARIABLES: Record<string, string> = {
  "font-primary": "font/primary/family",
  "font-heading": "font/primary/family",
  "font-primary-weight-regular": "font/primary/weight/regular",
  "font-primary-weight-emphasis": "font/primary/weight/emphasis",
  "font-primary-letter-spacing": "font/primary/letter-spacing",
  "font-secondary": "font/secondary/family",
  "font-serif": "font/secondary/family",
  "font-secondary-weight-regular": "font/secondary/weight/regular",
  "font-secondary-weight-emphasis": "font/secondary/weight/emphasis",
  "font-secondary-letter-spacing": "font/secondary/letter-spacing",
  "font-body-token": "font/body/family",
  "font-body": "font/body/family",
  "font-sans": "font/body/family",
  "font-body-weight": "font/body/regular/weight",
  "font-body-letter-spacing": "font/body/regular/letter-spacing",
  "font-body-weight-action": "font/body/action/weight",
}

/** The theme settings: the CSS custom property, the Figma setting. */
const SETTING_VARIABLES: Record<string, [string, (t: Theme) => string]> = {
  "theme-color-mode": ["settings/color-mode", (t) => t.colorMode],
  "theme-ui-color": ["settings/ui-color", (t) => t.uiColor],
  "theme-shadow": ["settings/shadow", (t) => t.shadow],
  "theme-material": ["settings/texture", (t) => t.material],
  "theme-motion": ["settings/motion", (t) => t.motion],
  "motion-ease": ["settings/motion", (t) => t.motion],
  "motion-duration": ["settings/motion", (t) => t.motion],
  "motion-fast": ["settings/motion", (t) => t.motion],
  "motion-transition-ease": ["settings/motion", (t) => t.motion],
}

const TEXT_STEP: Record<string, string> = {
  xs: "xs", sm: "sm", md: "md", base: "md", lg: "lg", xl: "lg",
  "2xl": "h6", "3xl": "h5", "4xl": "h4", "5xl": "h3", "6xl": "h2", "7xl": "h1",
}

const EASING_GROUP: Record<string, string> = { "ease-in-out": "emphatic", "ease-in": "ease-in", "ease-out": "ease" }

/**
 * The Figma variable behind a code token (the custom property name without `--`), with the mode the theme uses,
 * or null when there is none.
 */
export function figmaVariableFor(token: string, theme: Theme): FigmaVariable | null {
  const at = (variable: string, mode: string): FigmaVariable => ({ variable, mode })
  const t = token.replace(/^--/, "")

  if (SEMANTIC_COLOURS.has(t)) return at(`color/semantic/${t}`, theme.id)
  if (t === "affirmative-foreground") return at("color/semantic/foreground", theme.id)
  if (UI_COLOURS.has(t)) return at(`ui-color/${t}`, theme.uiColor)
  const primitive = t.match(/^primitive-(700|800)$/)
  if (primitive) return at(`color/primitive/color-${primitive[1]}`, theme.id)
  if (t === "card" || t === "card-image") return at("settings/texture", theme.material)

  if (FONT_VARIABLES[t]) return at(FONT_VARIABLES[t], theme.id)
  // the weight each heading level takes is the primary font's regular weight
  if (/^h[1-6]-weight$/.test(t)) return at("font/primary/weight/regular", theme.id)
  if (SETTING_VARIABLES[t]) return at(SETTING_VARIABLES[t][0], SETTING_VARIABLES[t][1](theme))

  // sizes: the typescale steps, by their own names, by the text styles that read them, and by the heading sizes
  const step = t.match(/^typescale-(\w+)$/)?.[1] ?? t.match(/^text-(xs|sm|md|base|lg|xl|[2-7]xl)(?:-italic|-bold)?$/)?.[1]
  if (step && TEXT_STEP[step]) return at(`typescale/${TEXT_STEP[step]}`, theme.scale)
  if (/^typescale-(xs|sm|md|lg|h[1-6])$/.test(t)) return at(`typescale/${t.slice("typescale-".length)}`, theme.scale)
  const heading = t.match(/^(?:h([1-6])-size|text-h([1-6])-(?:pri|sec)(?:-bold)?|h([1-6]))$/)
  if (heading) return at(`typescale/h${heading[1] ?? heading[2] ?? heading[3]}`, theme.scale)

  // radius: the steps, the button radius, and the base radius (the md step)
  const radius = t.match(/^radius-(xs|sm|md|lg|xl|button)$/)
  if (radius) return at(`radius/${radius[1]}`, theme.radius)
  if (t === "radius") return at("radius/md", theme.radius)
  if (t === "dimensions-max") return at("dimensions/max", "single")

  // shadow: every shadow-* token is a step of the theme's shadow level
  const shadow = t.match(/^shadow(?:-(2xs|xs|sm|md|lg|xl|2xl))?$/)
  if (shadow) {
    const size = shadow[1]
    const step = size === "2xs" || size === "xs" ? "xs" : size === undefined || size === "sm" ? "sm" : size === "md" ? "md" : "lg"
    return at(`shadow/${step}`, theme.shadow)
  }

  // alpha washes and their blurs: one mode
  const wash = t.match(/^alpha-(dark|light)-(none|xs|sm|md|lg|xl)$/)
  if (wash) return at(`alpha/${wash[1]}/${wash[2]}`, "single")
  const blur = t.match(/^alpha-blur-(320|1200)-(\w+)$/)
  if (blur) return at(`alpha/blur/${blur[1]}/${blur[2]}`, "single")

  // motion: easing curves, springs and timings: one mode
  const ease = t.match(/^(ease-in-out|ease-in|ease-out)-(normal|slight|strong|back)$/)
  if (ease) return at(`easing/${EASING_GROUP[ease[1]]}/${ease[2]}`, "single")
  if (t === "ease-out-in-transition-out-in") return at("easing/ease-out-in/transition out-in", "single")
  const spring = t.match(/^spring-bounce-(subtle|normal|expressive)$/)
  if (spring) return at(`easing/springy/${spring[1]}`, "single")
  const timing = t.match(/^duration-(instant|fast|faster|long|longer|longest)$/)
  if (timing) return at(`timing/${timing[1]}`, "single")
  if (t === "ease-hold") return at("hold", "single")
  if (t === "ease-constant") return at("constant", "single")

  return null
}
