import type { FontThemeId } from "@workspace/ui/lib/font-theme-registry"

export interface ColorTheme {
  /** Theme id, also used as the class name next-themes applies to <html>. */
  id: string
  label: string
  /** The font theme this color theme is paired with — each color theme has exactly one font pairing. */
  fontTheme: FontThemeId
}

export const colorThemes: ColorTheme[] = [
  { id: "light", label: "Lighten Up", fontTheme: "chill-light" },
  { id: "dark", label: "Dark Mood", fontTheme: "dark-mode" },
  { id: "electric-pulse", label: "Electric Pulse", fontTheme: "electric-pulse" },
  { id: "acid-forest", label: "Acid Forest", fontTheme: "acid-forest" },
  { id: "carbon-mint", label: "Carbon Mint", fontTheme: "carbon-mint" },
  { id: "solar-violet", label: "Solar Violet", fontTheme: "solar-violet" },
  { id: "arctic-aurora", label: "Arctic Aurora", fontTheme: "arctic-aurora" },
  { id: "strawberry-matcha", label: "Strawberry Matcha", fontTheme: "strawberry-matcha" },
  { id: "metallic-mist", label: "Metallic Mist", fontTheme: "metallic-mist" },
]

export const colorThemeIds = colorThemes.map((t) => t.id)
export type ColorThemeId = (typeof colorThemes)[number]["id"]
