// The nine themes, from the Figma `Themes` file (one `theme` collection, nine
// modes), in the Figma order. The list order never decides the default:
// DEFAULT_THEME_ID does.
//
// Fonts the Figma file names that are not available here are swapped for the
// nearest face, listed in `substitutes` so the output can say so.

import { FONT_CHOICES, type FontChoice } from "./fonts"
import { DEFAULT_VALUES } from "./values"
import { NO_FEEL, type Theme } from "./types"


// `motion` is the Figma's settings/motion, per theme. Every other Feel choice is none.
const preset = (theme: Omit<Theme, "icons" | "values" | "feel">): Theme => ({
  ...theme,
  feel: NO_FEEL,
  icons: { style: "phosphor", weight: "regular" },
  values: [...DEFAULT_VALUES],
})

export const presets: Theme[] = [
  preset({
    id: "fabrik",
    label: "Fabrik",
    colorMode: "light",
    palette: {
      background: "#f4f1f1", foreground: "#2b2726", primary: "#40433e", primaryForeground: "#ffffff",
      secondary: "#e4cdd2", secondaryForeground: "#78565d", color700: "#5b90ac", color800: "#a77b84",
      // Fabrik's semantic mapping differs from the others: accent is color-600 with color-800 on it, muted text is color-800, and a popover is the foreground colour
      accent: "#78565d", accentForeground: "#a77b84", mutedForeground: "#a77b84", popover: "#2b2726", popoverForeground: "#f4f1f1",
    },
    fonts: {
      display: { family: "DentonVariable Test", weight: 420, emphasis: 320 },
      body: { family: "PP Neue Montreal", weight: 200, actionWeight: 400 },
      secondary: { family: "Denton Italic Variable Test", weight: 460, emphasis: 640 },
    },
    scale: "sm", spacing: "lg", radius: "strong", shadow: "strong", material: "glass", motion: "springy", uiColor: "modern",
  }),
  preset({
    id: "illuzion",
    label: "Illuzion",
    colorMode: "light",
    palette: {
      background: "#f7cae7", foreground: "#1b1717", primary: "#f2aeda", primaryForeground: "#ff4901",
      secondary: "#812961", secondaryForeground: "#ee98d0", color700: "#ee98d0", color800: "#ee98d0",
    },
    fonts: {
      display: { family: "Intan", weight: 400, emphasis: 400 },
      body: { family: "General Sans Variable", weight: 450, letterSpacing: 1, actionWeight: 450 },
      secondary: { family: "Intan", weight: 400, emphasis: 400 },
    },
    scale: "lg", spacing: "md", radius: "strong", shadow: "none", material: "solid", motion: "ease", uiColor: "alternative",
  }),
  preset({
    id: "laroc",
    label: "Laroc",
    colorMode: "dark",
    palette: {
      background: "#3a6be2", foreground: "#fbfbfc", primary: "#17347b", primaryForeground: "#fbfbfc",
      secondary: "#1b4bbe", secondaryForeground: "#a0b2df", color700: "#a0b2df", color800: "#a0b2df",
    },
    fonts: {
      display: { family: "GT Pressura Mono Trial", weight: 700, emphasis: 700 },
      body: { family: "Archivo", weight: 400, actionWeight: 400 },
      secondary: { family: "GT Pressura Mono Trial", weight: 700, emphasis: 700 },
    },
    scale: "sm", spacing: "md", radius: "rounded", shadow: "none", material: "solid", motion: "none", uiColor: "classic",
  }),
  preset({
    id: "bootshaus",
    label: "Bootshaus",
    colorMode: "dark",
    palette: {
      background: "#214c56", foreground: "#ffffff", primary: "#1e363c", primaryForeground: "#ffc937",
      secondary: "#ffc937", secondaryForeground: "#1e363c", color700: "#1e363c", color800: "#1e363c",
    },
    fonts: {
      display: { family: "ITC Garamond Std", weight: 800, emphasis: 800, letterSpacing: -2 },
      body: { family: "Inter", weight: 500, actionWeight: 500 },
      secondary: { family: "ITC Garamond Std", weight: 800, emphasis: 800, letterSpacing: -2 },
    },
    scale: "lg", spacing: "md", radius: "strong", shadow: "strong", material: "glass", motion: "ease", uiColor: "modern",
  }),
  preset({
    id: "berghain",
    label: "Berghain",
    colorMode: "dark",
    palette: {
      background: "#000000", foreground: "#fbfbfc", primary: "#ffffff", primaryForeground: "#000000",
      secondary: "#363636", secondaryForeground: "#ffffff", color700: "#ffffff", color800: "#ffffff",
    },
    fonts: {
      // Migra Extralight, as you asked, rather than the PP Editorial New the Figma variable names
      display: { family: "Migra", weight: 200, emphasis: 800 },
      body: { family: "Akkurat LL TT", weight: 200, actionWeight: 400 },
      secondary: { family: "Migra", weight: 200, emphasis: 800, italic: true },
    },
    scale: "md", spacing: "lg", radius: "subtle", shadow: "strong", material: "glass", motion: "ease", uiColor: "modern",
  }),
  preset({
    id: "savaya",
    label: "Savaya",
    colorMode: "dark",
    palette: {
      background: "#84699b", foreground: "#ffffff", primary: "#6f59bb", primaryForeground: "#ffffff",
      secondary: "#a56a62", secondaryForeground: "#734a45", color700: "#734a45", color800: "#734a45",
    },
    fonts: {
      display: { family: "Gloock", weight: 400, emphasis: 400 },
      body: { family: "Newsreader", weight: 400, letterSpacing: 1, actionWeight: 400 },
      secondary: { family: "Gloock", weight: 400, emphasis: 400 },
    },
    scale: "md", spacing: "md", radius: "subtle", shadow: "strong", material: "glass", motion: "emphatic", uiColor: "modern",
  }),
  preset({
    id: "pacha",
    label: "Pacha",
    colorMode: "light",
    palette: {
      // Figma maps Pacha's semantic colours differently: primary is color-500 on color-300, secondary is color-300 with color-500 on it
      background: "#ffe9e9", foreground: "#1b1717", primary: "#831a04", primaryForeground: "#ffffff",
      secondary: "#ffffff", secondaryForeground: "#831a04", color700: "#b38b83", color800: "#b38b83",
    },
    fonts: {
      display: { family: "Khaviax", weight: 400, emphasis: 400 },
      body: { family: "DM Sans", weight: 500, letterSpacing: 1, actionWeight: 500 },
      secondary: { family: "Khaviax", weight: 400, emphasis: 400 },
    },
    scale: "lg", spacing: "lg", radius: "rounded", shadow: "none", material: "solid", motion: "springy", uiColor: "alternative",
  }),
  preset({
    id: "amnesia",
    label: "Amnesia",
    colorMode: "dark",
    palette: {
      background: "#224f4a", foreground: "#f8f8f8", primary: "#122a27", primaryForeground: "#f8f8f8",
      secondary: "#23786e", secondaryForeground: "#0c1d1b", color700: "#0c1d1b", color800: "#0c1d1b",
    },
    fonts: {
      display: { family: "Swear Display Demo", weight: 500, emphasis: 500 },
      body: { family: "Inter", weight: 400, actionWeight: 400 },
      secondary: { family: "Swear Display Demo", weight: 500, emphasis: 500 },
    },
    scale: "md", spacing: "md", radius: "rounded", shadow: "subtle", material: "gradient", motion: "ease", uiColor: "modern",
  }),
  preset({
    id: "ushuaia",
    label: "Ushuaia",
    colorMode: "light",
    palette: {
      background: "#edebe3", foreground: "#0f0e0e", primary: "#222222", primaryForeground: "#0f0e0e",
      secondary: "#ffffff", secondaryForeground: "#222222", color700: "#222222", color800: "#222222",
    },
    fonts: {
      display: { family: "Migra", weight: 800, emphasis: 800 },
      body: { family: "Archivo", weight: 400, actionWeight: 400 },
      secondary: { family: "Migra", weight: 800, emphasis: 800 },
    },
    scale: "md", spacing: "lg", radius: "strong", shadow: "strong", material: "gradient", motion: "ease", uiColor: "classic",
  }),
]

export const DEFAULT_THEME_ID = "berghain"
export const presetIds = presets.map((t) => t.id)
export const getPreset = (id: string | undefined) => presets.find((t) => t.id === id)

/**
 * The faces the themes use for each role, in the catalogue's order. The Themer offers headings
 * from the first and body text from the second, so a heading is never set in a body face or the
 * other way round. Both follow the presets: change a preset and its font joins the list.
 */
const rolesOf = (...picks: ((t: Theme) => string)[]): FontChoice[] => {
  const used = new Set(presets.flatMap((t) => picks.map((pick) => pick(t))))
  return FONT_CHOICES.filter((f) => used.has(f.family))
}
export const HEADING_FONTS = rolesOf((t) => t.fonts.display.family)
// body text can be set in a sans or a serif: the themes' body faces
export const BODY_FONTS = rolesOf((t) => t.fonts.body.family)
