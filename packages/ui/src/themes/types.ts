import type { UiColor } from "./ui-color"

// The theme model. It follows the Figma `theme` variable collection: a palette,
// three font roles, the six settings, icons, the UX direction and the feel
// (component motion, page transitions, an animated background and the hero).

export const RADII = ["sharp", "subtle", "strong", "rounded"] as const
export const SHADOW_LEVELS = ["none", "subtle", "strong"] as const
export const MATERIALS = ["solid", "glass", "gradient"] as const
export const SPACINGS = ["sm", "md", "lg"] as const
/** The Figma `typescale` modes: the set of heading and body sizes a theme uses (see typescale.ts). */
export const SCALES = ["sm", "md", "lg"] as const
/** The Figma's Settings/motion: none, ease (ease-out, slower), emphatic (ease-in-out, faster), springy. */
export const MOTIONS = ["none", "ease", "emphatic", "springy"] as const

/* The Feel page's choices, in the order the Figma lists them. "none" is always the first. */
export const TRANSITIONS = ["none", "blinds", "iris", "curtain", "fade", "curtain-iris"] as const
export const TRANSITION_COLORS = ["foreground", "primary"] as const
export const SPEEDS = ["slow", "medium", "fast"] as const
export const BACKGROUNDS = ["none", "aurora", "smoke", "ascii", "holo", "eighties"] as const
export const OVERLAYS = [8, 24, 40, 56, 64, 80] as const
export const HERO_HEADINGS = ["none", "gradient", "shimmering"] as const
export const HERO_TEXTS = ["none", "rolling", "scramble", "typewriter", "splitting", "vertical-cut"] as const
export const CLICKS = ["none", "ring", "ripple", "crosshair", "burst", "particles"] as const
export const LINK_HOVERS = ["none", "underline", "highlight"] as const
export const ICON_STYLES = ["phosphor", "lucide"] as const
export const ICON_WEIGHTS = ["thin", "light", "regular", "bold", "fill", "duotone"] as const

export type Radius = (typeof RADII)[number]
export type Shadow = (typeof SHADOW_LEVELS)[number]
export type Material = (typeof MATERIALS)[number]
export type Spacing = (typeof SPACINGS)[number]
export type Scale = (typeof SCALES)[number]
export type Motion = (typeof MOTIONS)[number]
export type TransitionStyle = (typeof TRANSITIONS)[number]
export type TransitionColor = (typeof TRANSITION_COLORS)[number]
export type TransitionSpeed = (typeof SPEEDS)[number]
export type BackgroundStyle = (typeof BACKGROUNDS)[number]
export type Overlay = (typeof OVERLAYS)[number]
export type HeroHeading = (typeof HERO_HEADINGS)[number]
export type HeroText = (typeof HERO_TEXTS)[number]
export type ButtonClick = (typeof CLICKS)[number]
export type LinkHover = (typeof LINK_HOVERS)[number]
export type IconStyle = (typeof ICON_STYLES)[number]
export type IconWeight = (typeof ICON_WEIGHTS)[number]
export type ColorMode = "light" | "dark"

export interface ThemeFont {
  family: string
  /** The regular weight: Figma `font/primary|secondary/regular` (body: `font/body/regular/weight`). */
  weight: number
  /** The emphasis weight, Figma `font/primary|secondary/emphasis`. Defaults to `weight`. */
  emphasis?: number
  /** The weight a button's text takes, Figma `font/body/action/weight` (body only). Defaults to `weight`. */
  actionWeight?: number
  /** The face is the italic of its family (Figma writes it into the name, "Migra Italic"). */
  italic?: boolean
  /** The font's line height as a percent of its size, written as `--font-<role>-line-height`. Defaults to 160 for body and 140 for the primary and secondary (heading) faces, the Figma text styles. */
  lineHeight?: number
  /** The font's letter spacing as a percent of the size: the Figma `font/<role>/letter-spacing`. Defaults to 0. */
  letterSpacing?: number
}

/** Hex colours. The primitives of the Figma file (color-100 to color-800). The status and chart colours come from `uiColor`. */
export interface ThemePalette {
  background: string
  foreground: string
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  /** The Figma primitives color-700 and color-800 (new). Nothing reads them yet; the semantic colours come from the other six. */
  color700: string
  color800: string
  /** Where a theme maps these semantic colours to a primitive other than the default (accent = secondary, popover = background), the hex it takes. */
  accent?: string
  accentForeground?: string
  /** Where muted-foreground is a primitive at full strength, not the foreground at 65%, the hex it takes. */
  mutedForeground?: string
  popover?: string
  popoverForeground?: string
}

export interface ThemeIcons {
  style: IconStyle
  weight: IconWeight
}

/**
 * The Feel page: page transition, animated background and hero effects. Every theme has one; "none"
 * everywhere is a theme that does nothing. The settings under a style (a transition's colour and
 * speed, a background's colours and overlay) only matter while that style is not none.
 */
export interface ThemeFeel {
  transition: TransitionStyle
  transitionColor: TransitionColor
  transitionSpeed: TransitionSpeed
  animatedBackground: BackgroundStyle
  /** Paint the background with the theme's own colours. */
  animatedBackgroundThemeColors: boolean
  /** Swap the colours it is painted with: the foreground as the base, the background as the highlight. */
  animatedBackgroundInverse: boolean
  /** A scrim over the background, in percent. */
  animatedBackgroundOverlay: Overlay
  heroHeading: HeroHeading
  heroText: HeroText
  buttonClick: ButtonClick
  linkHover: LinkHover
}

/** A theme that does nothing: what every preset has. */
export const NO_FEEL: ThemeFeel = {
  transition: "none",
  transitionColor: "foreground",
  transitionSpeed: "medium",
  animatedBackground: "none",
  animatedBackgroundThemeColors: false,
  animatedBackgroundInverse: false,
  animatedBackgroundOverlay: 8,
  heroHeading: "none",
  heroText: "none",
  buttonClick: "none",
  linkHover: "none",
}

/** One answer per question: "a" is the first option, "b" the second. */
export type ValueAnswer = "a" | "b"
export type ThemeValues = [ValueAnswer, ValueAnswer, ValueAnswer, ValueAnswer]

export interface Theme {
  /** Slug. Also the CSS class the theme is scoped to. */
  id: string
  label: string
  colorMode: ColorMode
  palette: ThemePalette
  /** display is the Figma `font/primary`, body its `font/body`, secondary its `font/secondary`. */
  fonts: { display: ThemeFont; body: ThemeFont; secondary: ThemeFont }
  scale: Scale
  spacing: Spacing
  radius: Radius
  shadow: Shadow
  material: Material
  /** The Figma `Settings/motion` value: Component Animations. Carried in the output. */
  motion: Motion
  /** The Figma `settings/ui-color`: which `ui-color` collection (classic, modern, alternative) the status and chart colours come from. */
  uiColor: UiColor
  feel: ThemeFeel
  icons: ThemeIcons
  values: ThemeValues
}

/** What the Themer holds while a theme is being built: any part can still be empty. */
export interface ThemeDraft extends Partial<ThemeFeel> {
  motion?: Motion
  label: string
  background?: string
  foreground?: string
  primary?: string
  secondary?: string
  headingFont?: string
  headingWeight?: number
  /** The Figma `font/secondary`. Left empty it is the heading font. */
  headingSecondaryFont?: string
  headingSecondaryWeight?: number
  bodyFont?: string
  bodyWeight?: number
  scale?: Scale
  material?: Material
  radius?: Radius
  shadow?: Shadow
  /** The Figma `settings/ui-color`: which ui-color mode the status and chart colours come from. Left empty it is the baseline's. */
  uiColor?: UiColor
  spacing?: Spacing
  iconStyle?: IconStyle
  iconWeight?: IconWeight
  values: (ValueAnswer | undefined)[]
}
