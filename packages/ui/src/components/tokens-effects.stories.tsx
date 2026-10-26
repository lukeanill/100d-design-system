import * as React from "react"

import { NAME, NAME_SIZE, OUTLINE, ROW, Sheet, SHEET, SheetLabel, sheetText } from "./tokens-sheet"

/**
 * The Effects column of the Figma sheet, on the same frame as Typography and
 * Colors: how the theme shapes things (edges and shadows) and moves them (its
 * page transition and animated background). Radius and Shadows used to be
 * separate pages; they are the first two groups here.
 *
 * Every name is read off the active theme, so switching theme in the toolbar
 * changes the page.
 */

const SHADOWS = ["shadow-xs", "shadow-sm", "shadow-md", "shadow-lg", "shadow-xl", "shadow-2xl"] as const

/** Read a custom property off the root, again whenever the theme or its classes change. */
function useRootProperty(name: string) {
  const [value, setValue] = React.useState("")
  React.useEffect(() => {
    const read = () => setValue(getComputedStyle(document.documentElement).getPropertyValue(name).trim())
    read()
    const observer = new MutationObserver(read)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style"] })
    return () => observer.disconnect()
  }, [name])
  return value
}

/** The size of a CSS length in px, for naming it: rem is read at the root's 16px. */
const toPx = (length: string) => {
  const n = parseFloat(length)
  if (!Number.isFinite(n)) return 0
  return length.endsWith("rem") ? n * 16 : n
}

/** How round a theme is, named the way the studio names it. */
function edgeName(radius: string) {
  const px = toPx(radius)
  if (px === 0) return "Square"
  if (px <= 6) return "Subtle"
  if (px <= 16) return "Strong"
  return "Rounded"
}

/**
 * How dark a theme draws its shadows, from the strongest alpha in its largest
 * one: Light is a 6% shadow, Medium twice that, Dark four times (see
 * shadowDeclarations in theme-settings.mjs).
 */
function shadowName(shadow: string) {
  const alphas = [...shadow.matchAll(/\/\s*([\d.]+)%/g)].map((m) => parseFloat(m[1]))
  const strongest = Math.max(0, ...alphas)
  if (strongest <= 8) return "Light"
  if (strongest <= 16) return "Medium"
  return "Dark"
}

/** Cards follow the theme's radius but stop short of a pill, which only a swatch of the radius itself should be. */
const CARD_RADIUS = "min(var(--radius), 24px)"

/** Taller than a colour swatch, about 2:1, so an edge or a shadow has room to read. */
const swatchBase = { width: SHEET.column, maxWidth: "50%", aspectRatio: "2 / 1", background: "var(--muted)" }

export default { title: "Tokens/Effects", parameters: { layout: "fullscreen" } }

export const Effects = () => {
  const radius = useRootProperty("--radius")
  const shadow = useRootProperty("--shadow-2xl")

  return (
    <Sheet gap={SHEET.groups}>
      <section>
        <SheetLabel>Edges</SheetLabel>
        <div style={{ marginTop: 8 }}>
          <div style={ROW}>
            <span style={NAME}>{edgeName(radius)}</span>
            <div title="--radius" style={{ ...swatchBase, background: "var(--accent)", borderRadius: "var(--radius)", boxShadow: OUTLINE }} />
          </div>
        </div>
      </section>

      <section>
        <SheetLabel>Shadows</SheetLabel>
        <div style={{ marginTop: 8 }}>
          <div style={{ ...ROW, borderBottom: 0, paddingBottom: 32 }}>
            <span style={NAME}>{shadowName(shadow)}</span>
            <div
              title="--shadow-2xl"
              style={{ ...swatchBase, background: "var(--card)", borderRadius: CARD_RADIUS, boxShadow: "var(--shadow-2xl)" }}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gap: 16, paddingBottom: 24, borderBottom: SHEET.rule }}>
            {SHADOWS.map((token) => (
              <div
                key={token}
                title={`--${token}`}
                style={{
                  ...sheetText,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  aspectRatio: "1 / 1",
                  fontSize: 16,
                  background: "var(--card)",
                  borderRadius: CARD_RADIUS,
                  boxShadow: `var(--${token})`,
                }}
              >
                {token.replace("shadow-", "")}
              </div>
            ))}
          </div>
        </div>
      </section>
    </Sheet>
  )
}
