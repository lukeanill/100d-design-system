import type { FontThemeId } from "@workspace/ui/lib/font-theme-registry"

export interface ColorTheme {
  /** Theme id, also used as the class name next-themes applies to <html>. */
  id: string
  label: string
  /** The font theme this color theme is paired with — each color theme has exactly one font pairing. */
  fontTheme: FontThemeId
  /** The theme's primary colour, for pickers that show a theme as a dot. */
  primary: string
  /** Position in the studio's list. Pickers sort by this, not by array order. */
  order: number
}

export const colorThemes: ColorTheme[] = [
  { id: "dark", label: "Dark Mood", fontTheme: "dark-mode", primary: "oklch(0.993 0.004 56.38)", order: 1 },
  { id: "electric-pulse", label: "Electric Pulse", fontTheme: "electric-pulse", primary: "oklch(0.580 0.233 278.14)", order: 7 },
  { id: "acid-forest", label: "Acid Forest", fontTheme: "acid-forest", primary: "oklch(0.944 0.220 118.56)", order: 2 },
  { id: "carbon-mint", label: "Carbon Mint", fontTheme: "carbon-mint", primary: "oklch(0.520 0.053 174.97)", order: 8 },
  { id: "arctic-aurora", label: "Arctic Aurora", fontTheme: "arctic-aurora", primary: "oklch(0.541 0.241 267.63)", order: 9 },
  { id: "strawberry-matcha", label: "Strawberry Matcha", fontTheme: "strawberry-matcha", primary: "oklch(0.551 0.155 14.40)", order: 5 },
  { id: "metallic-mist", label: "Metallic Mist", fontTheme: "metallic-mist", primary: "oklch(0.538 0.228 276.05)", order: 10 },
  { id: "bumblebee", label: "Bumblebee", fontTheme: "bumblebee", primary: "oklch(0.000 0.000 0.00)", order: 4 },
  { id: "light", label: "Lighten Up", fontTheme: "chill-light", primary: "oklch(0.248 0.000 0.00)", order: 0 },
  { id: "solar-azul", label: "Solar Azul", fontTheme: "solar-azul", primary: "oklch(0.568 0.221 265.35)", order: 3 },
  { id: "night-violet", label: "Night Violet", fontTheme: "night-violet", primary: "oklch(0.787 0.059 313.08)", order: 6 },
  { id: "lighten-up", label: "Lighten Up", fontTheme: "chill-light", primary: "oklch(0.248 0.000 0.00)", order: 11 },
]

export const colorThemeIds = colorThemes.map((t) => t.id)
export type ColorThemeId = (typeof colorThemes)[number]["id"]
