import type { CSSProperties } from "react"

import { getPreset } from "@workspace/ui/themes"

export type Edges = "square" | "subtle" | "strong" | "round"
export type TextSize = "small" | "medium" | "large"

/** What the Styling menu can change, on top of whichever theme is chosen. */
export type Styling = {
  /** `null` leaves the theme's own edges alone. */
  edges: Edges | null
  glass: boolean
  textSize: TextSize
}

export const DEFAULT_STYLING: Styling = { edges: null, glass: false, textSize: "medium" }

export const EDGE_OPTIONS: { id: Edges; label: string }[] = [
  { id: "square", label: "Square" },
  { id: "subtle", label: "Subtle" },
  { id: "strong", label: "Strong" },
  { id: "round", label: "Round" },
]

export const TEXT_SIZE_OPTIONS: { id: TextSize; label: string }[] = [
  { id: "small", label: "Small" },
  { id: "medium", label: "Medium" },
  { id: "large", label: "Large" },
]

/** The same pairs the themes themselves use, so an edge here is an edge there. */
const EDGE_VALUES: Record<Edges, { radius: string; container: string }> = {
  square: { radius: "0", container: "0" },
  subtle: { radius: "0.5rem", container: "1rem" },
  strong: { radius: "0.75rem", container: "1.5rem" },
  round: { radius: "9999px", container: "2rem" },
}

/** Heading sizes, h1 to h6, for the two scales Small and Large pick. Medium is the theme's own. */
const TEXT_SCALE: Record<TextSize, string[] | undefined> = {
  small: ["3.75rem", "3rem", "2.25rem", "1.75rem", "1.375rem", "1.125rem"],
  medium: undefined,
  large: ["4.75rem", "3.625rem", "2.75rem", "2.0625rem", "1.5625rem", "1.1875rem"],
}

/** Clear glass on every surface that can be glass: blur and saturation, no tint. */
const GLASS_GROUPS = ["card", "action", "input", "select", "overlay", "dialog"]
const glassLines = GLASS_GROUPS.flatMap((name) => [
  `--glass-${name}-layer: "";`,
  `--glass-${name}-blur: 40px;`,
  `--glass-${name}-saturate: 150%;`,
  `--glass-${name}-surface: transparent;`,
])

/** The custom properties a Styling choice sets, as name → value. */
export function stylingDeclarations(styling: Styling): Record<string, string> {
  const lines: string[] = []
  if (styling.edges) {
    const { radius, container } = EDGE_VALUES[styling.edges]
    lines.push(`--radius: ${radius};`, `--radius-container: ${container};`)
  }
  if (styling.glass) lines.push(...glassLines)
  const scale = TEXT_SCALE[styling.textSize]
  if (scale) scale.forEach((size, i) => lines.push(`--h${i + 1}-size: ${size};`))

  return Object.fromEntries(
    lines.map((line) => {
      const [name, ...rest] = line.replace(/;$/, "").split(":")
      return [name.trim(), rest.join(":").trim()]
    })
  )
}

/**
 * The font aliases, declared on the element that wears the theme.
 *
 * A `var()` inside a custom property resolves where the property is declared,
 * so the aliases set once at :root keep pointing at the page's own faces. They
 * are restated here so they resolve against this element's font pairing.
 */
const FONT_ALIASES: Record<string, string> = {
  "--font-heading": "var(--font-primary)",
  "--font-body": "var(--font-body-token)",
  "--font-body-small": "var(--font-body-token)",
  "--font-serif": "var(--font-emphasis)",
  "--font-sans": "var(--font-body-token)",
  "--font-family": "var(--font-body-token)",
}

/**
 * What makes one element wear a theme: the theme's class 
 * and the Styling choices as custom properties. With no theme, only the
 * Styling choices; the element stays on the page's own.
 */
export function themeScope(themeId: string | null, styling: Styling) {
  const theme = getPreset(themeId ?? undefined)
  // a theme chosen here must not inherit the page theme's per-heading faces:
  // `initial` is the guaranteed-invalid value, so `var(--h3-family, fallback)`
  // reaches its fallback again
  const resets = theme
    ? Object.fromEntries(["h1", "h2", "h3", "h4", "h5", "h6"].map((level) => [`--${level}-family`, "initial"]))
    : {}
  return {
    className: theme?.id,
    style: { ...(theme ? FONT_ALIASES : {}), ...resets, ...stylingDeclarations(styling) } as CSSProperties,
  }
}
