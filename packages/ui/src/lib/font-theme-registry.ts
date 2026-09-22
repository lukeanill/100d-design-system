export type FontThemeId =
  | "chill-light"
  | "dark-mode"
  | "electric-pulse"
  | "acid-forest"
  | "carbon-mint"
  | "solar-azul"
  | "arctic-aurora"
  | "strawberry-matcha"
  | "metallic-mist"
  | "bumblebee"
  | "night-violet"

export interface FontTheme {
  id: FontThemeId
  label: string
  primaryFont: string
  secondaryFont: string
}

export const fontThemes: FontTheme[] = [
  { id: "chill-light", label: "Chill Light", primaryFont: "Authentic Sans 60", secondaryFont: "Instrument Serif" },
  { id: "dark-mode", label: "Dark Mode", primaryFont: "Instrument Serif", secondaryFont: "Instrument Serif" },
  { id: "electric-pulse", label: "Electric Pulse", primaryFont: "Geist Mono", secondaryFont: "Geist" },
  { id: "acid-forest", label: "Acid Forest", primaryFont: "Migra", secondaryFont: "MRK Maston" },
  { id: "carbon-mint", label: "Carbon Mint", primaryFont: "Inter", secondaryFont: "New York" },
  { id: "solar-azul", label: "Solar Azul", primaryFont: "Gudea", secondaryFont: "IBM Plex Mono" },
  { id: "arctic-aurora", label: "Arctic Aurora", primaryFont: "Grenze", secondaryFont: "Grenze Gotisch" },
  { id: "strawberry-matcha", label: "Strawberry Matcha", primaryFont: "MADE Gentle", secondaryFont: "Playfair Display" },
  { id: "metallic-mist", label: "Metallic Mist", primaryFont: "Authentic Sans 90", secondaryFont: "Lora" },
  { id: "bumblebee", label: "Bumblebee", primaryFont: "Work Sans", secondaryFont: "Plus Jakarta Sans" },
  { id: "night-violet", label: "Night Violet", primaryFont: "Eczar", secondaryFont: "Eczar" },
]

export const fontThemeIds = fontThemes.map((t) => t.id) as [FontThemeId, ...FontThemeId[]]
