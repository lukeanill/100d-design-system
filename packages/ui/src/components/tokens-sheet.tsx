import * as React from "react"

/**
 * The page the Typography and Colors stories share, taken from the Figma
 * "New Theme" sheet: the same 1280 frame with 80px sides, sections 160px
 * apart, a 32px label over a 96px name (or row), and a 1px rule. Both pages
 * set their type in the theme's primary face.
 */

export const SHEET = {
  /** the label over a specimen, on the Typography page */
  label: 32,
  /** the smaller label over a group of rows, on the Colors and Effects pages */
  groupLabel: 20,
  name: 96,
  gap: 16,
  /** between specimens on the Typography page */
  sections: 160,
  /** between groups of rows on the Colors and Effects pages, which sit closer */
  groups: 80,
  /** the right-hand column of both sheets: the glyph sample, and the colour swatch */
  column: 407,
  rule: "1px solid var(--foreground)",
}

export const sheetText: React.CSSProperties = {
  fontFamily: "var(--font-heading)",
  color: "var(--foreground)",
  lineHeight: 1.2,
}

export function Sheet({ children, gap = SHEET.sections }: { children: React.ReactNode; gap?: number }) {
  return (
    <div className="min-h-screen w-full bg-background">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap,
          maxWidth: 1280,
          margin: "0 auto",
          padding: "96px 80px 160px",
        }}
      >
        {children}
      </div>
    </div>
  )
}

/** The 80px band between a section's name and what it lists, with the rule across its middle. */
export const Rule = () => <div style={{ borderTop: SHEET.rule, margin: "40px 0" }} />

export function SheetLabel({ children }: { children: React.ReactNode }) {
  return <p style={{ ...sheetText, fontSize: SHEET.groupLabel, margin: 0, opacity: 0.5 }}>{children}</p>
}

/** Row names are Heading 4, from the theme's own scale, and a swatch is one line of it tall. */
export const NAME_SIZE = "var(--h4-size, 48px)"

export const NAME = { fontSize: NAME_SIZE }

/** A ruled row: the name on the left, what it names on the right. */
export const ROW: React.CSSProperties = {
  ...sheetText,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 24,
  padding: "24px 0",
  borderBottom: SHEET.rule,
}

export const OUTLINE = "inset 0 0 0 1px color-mix(in oklab, var(--foreground) 12%, transparent)"
