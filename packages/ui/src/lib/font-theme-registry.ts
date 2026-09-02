export type FontThemeId =
  | "chill-light"
  | "dark-mode"
  | "electric-pulse"
  | "acid-forest"
  | "carbon-mint"
  | "solar-violet"
  | "arctic-aurora"
  | "strawberry-matcha"
  | "metallic-mist"

export interface FontTheme {
  id: FontThemeId
  label: string
  primaryFont: string
  secondaryFont: string
}

export const fontThemes: FontTheme[] = [
  { id: "chill-light", label: "Chill Light", primaryFont: "AUTHENTIC Sans 60", secondaryFont: "Oranienbaum" },
  { id: "dark-mode", label: "Dark Mode", primaryFont: "AUTHENTIC Sans 60", secondaryFont: "Oranienbaum" },
  { id: "electric-pulse", label: "Electric Pulse", primaryFont: "Geist Mono", secondaryFont: "Geist" },
  { id: "acid-forest", label: "Acid Forest", primaryFont: "Migra", secondaryFont: "Koulen" },
  { id: "carbon-mint", label: "Carbon Mint", primaryFont: "Inter", secondaryFont: "New York" },
  { id: "solar-violet", label: "Solar Violet", primaryFont: "Gudea", secondaryFont: "IBM Plex Mono" },
  { id: "arctic-aurora", label: "Arctic Aurora", primaryFont: "Grenze", secondaryFont: "Grenze Gotisch" },
  { id: "strawberry-matcha", label: "Strawberry Matcha", primaryFont: "SF Pro Text", secondaryFont: "Playfair Display" },
  { id: "metallic-mist", label: "Metallic Mist", primaryFont: "AUTHENTIC Sans 90", secondaryFont: "Lora" },
]

export const fontThemeIds = fontThemes.map((t) => t.id) as [FontThemeId, ...FontThemeId[]]
