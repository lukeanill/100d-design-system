// The theme model. It follows the Figma `theme` variable collection: a palette,
// three font roles, the six settings, icons and the UX direction. The "feel"
// choices (animation, transitions, special FX) arrive in phase 2.

export const RADII = ["sharp", "subtle", "strong", "rounded"] as const
export const ELEVATIONS = ["none", "subtle", "strong"] as const
export const MATERIALS = ["solid", "glass", "gradient"] as const
export const SPACINGS = ["md", "lg"] as const
export const MOTIONS = ["none", "smooth", "expressive", "spring"] as const
export const ICON_STYLES = ["phosphor", "lucide"] as const
export const ICON_WEIGHTS = ["thin", "light", "regular", "bold", "fill", "duotone"] as const

export type Radius = (typeof RADII)[number]
export type Elevation = (typeof ELEVATIONS)[number]
export type Material = (typeof MATERIALS)[number]
export type Spacing = (typeof SPACINGS)[number]
export type Motion = (typeof MOTIONS)[number]
export type IconStyle = (typeof ICON_STYLES)[number]
export type IconWeight = (typeof ICON_WEIGHTS)[number]
export type Scheme = "light" | "dark"

export interface ThemeFont {
  family: string
  weight: number
}

/** Hex colours. The six primitives of the Figma file plus the status colours. */
export interface ThemePalette {
  background: string
  foreground: string
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  destructive: string
  charts: [string, string, string, string, string]
}

export interface ThemeIcons {
  style: IconStyle
  weight: IconWeight
}

/** One answer per question: "a" is the first option, "b" the second. */
export type ValueAnswer = "a" | "b"
export type ThemeValues = [ValueAnswer, ValueAnswer, ValueAnswer, ValueAnswer]

export interface Theme {
  /** Slug. Also the CSS class the theme is scoped to. */
  id: string
  label: string
  scheme: Scheme
  palette: ThemePalette
  fonts: { display: ThemeFont; body: ThemeFont; serif: ThemeFont }
  spacing: Spacing
  radius: Radius
  elevation: Elevation
  material: Material
  /** The Figma `Settings/motion` value. Carried in the output; components do not read it yet. */
  motion: Motion
  icons: ThemeIcons
  values: ThemeValues
}

/** What the Themer holds while a theme is being built: any part can still be empty. */
export interface ThemeDraft {
  label: string
  background?: string
  primary?: string
  secondary?: string
  headingFont?: string
  headingWeight?: number
  bodyFont?: string
  bodyWeight?: number
  material?: Material
  radius?: Radius
  elevation?: Elevation
  spacing?: Spacing
  iconStyle?: IconStyle
  iconWeight?: IconWeight
  values: (ValueAnswer | undefined)[]
}
