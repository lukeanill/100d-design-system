// The Figma `typescale` collection, as tokens: one set of font sizes for each mode (sm, md, lg).
// A theme's `scale` is its `settings/typescale` in the Figma file, and picks the set. There is no
// multiplier: every size is written out. tokens.css and the Tailwind text sizes read these.

import type { Scale } from "./types"

/** The steps, smallest to largest: body xs to lg, then headings h6 to h1. */
export const TYPE_STEPS = ["xs", "sm", "md", "lg", "h6", "h5", "h4", "h3", "h2", "h1"] as const
export type TypeStep = (typeof TYPE_STEPS)[number]

/** Font sizes in px, by step, for each Figma typescale mode. */
export const TYPESCALE: Record<Scale, Record<TypeStep, number>> = {
  sm: { xs: 12, sm: 13, md: 14, lg: 16, h6: 20, h5: 24, h4: 28, h3: 36, h2: 44, h1: 60 },
  md: { xs: 12, sm: 14, md: 16, lg: 18, h6: 24, h5: 30, h4: 36, h3: 48, h2: 60, h1: 72 },
  lg: { xs: 14, sm: 16, md: 18, lg: 20, h6: 26, h5: 36, h4: 44, h3: 56, h2: 72, h1: 88 },
}

/** The Tailwind text size each step stands in for: text-xs to text-xl (xl takes lg), then text-2xl to text-7xl. */
export const TAILWIND_TEXT: Record<string, TypeStep> = {
  xs: "xs", sm: "sm", base: "md", lg: "lg", xl: "lg", "2xl": "h6", "3xl": "h5", "4xl": "h4", "5xl": "h3", "6xl": "h2", "7xl": "h1",
}

/** The Figma text styles' line-heights: body steps (body/*) 160%, heading steps (pri/reg/h*) 140%. */
export const BODY_LINE_HEIGHT = 1.6
export const HEADING_LINE_HEIGHT = 1.4

/** The line-height Tailwind's text-<name> takes: body for xs to xl, heading for 2xl and up. */
export const tailwindLineHeight = (name: string) => (name in TAILWIND_TEXT && TAILWIND_TEXT[name].startsWith("h") ? HEADING_LINE_HEIGHT : BODY_LINE_HEIGHT)

export const rem = (px: number) => `${px / 16}rem`
