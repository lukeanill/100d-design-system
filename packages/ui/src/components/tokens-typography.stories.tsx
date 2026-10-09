import { useEffect, useState } from "react"

import { Rule, Sheet, SHEET, sheetText } from "./tokens-sheet"

/** The three specimens: the heading face, the emphasis face, and the body face. */
const FONT_FAMILIES = [
  { label: "Primary", token: "font-heading" },
  { label: "Emphasis", token: "font-serif" },
  { label: "Body", token: "font-body" },
] as const

function resolvedFontName(token: string) {
  if (typeof window === "undefined") return ""
  const stack = getComputedStyle(document.documentElement).getPropertyValue(`--${token}`)
  return stack.split(",")[0]?.trim().replace(/^["']|["']$/g, "") ?? ""
}

function useResolvedFontNames() {
  const [names, setNames] = useState<Record<string, string>>({})

  useEffect(() => {
    const update = () => {
      setNames(Object.fromEntries(FONT_FAMILIES.map((fam) => [fam.token, resolvedFontName(fam.token)])))
    }
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-font-theme"] })
    return () => observer.disconnect()
  }, [])

  return names
}

const HEADINGS = [1, 2, 3, 4, 5, 6] as const

const GLYPHS = ["£123$4567€890", "!#@;-?", "“ty**”"]

const BODY_STYLES = [
  { className: "text-body-lg", label: "Body Large" },
  { className: "text-body", label: "Body" },
  { className: "text-body-small", label: "Body Small" },
] as const

export default { title: "Tokens/Typography", parameters: { layout: "fullscreen" } }

/** A heading size straight from the theme's scale, so Compact and Classic show as they are. */
const headingSize = (level: number) => `var(--h${level}-size, ${[96, 80, 64, 48, 32, 24][level - 1]}px)`

function Specimen({ label, token, name }: { label: string; token: string; name: string }) {
  const family = { ...sheetText, fontFamily: `var(--${token})` }
  const isBody = token === "font-body"
  return (
    <section>
      <div style={{ ...family, display: "flex", flexDirection: "column", gap: SHEET.gap }}>
        <p style={{ fontSize: SHEET.groupLabel, margin: 0, opacity: 0.5 }}>{label}</p>
        <p style={{ fontSize: SHEET.name, margin: 0 }}>{name || "—"}</p>
      </div>
      <Rule />
      {isBody ? (
        <div style={{ ...family, display: "flex", flexDirection: "column", gap: 16, maxWidth: 505 }}>
          {BODY_STYLES.map((b) => (
            <div key={b.label} className={b.className} style={{ lineHeight: 1.6 }}>
              <p style={{ margin: 0 }}>{b.label}</p>
              <p style={{ margin: 0 }}>The quick brown fox jumped over the lazy dog.</p>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ ...family, display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 48 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 550, maxWidth: "100%", whiteSpace: "nowrap" }}>
            {HEADINGS.map((level) => (
              <p key={level} style={{ fontSize: headingSize(level), margin: 0 }}>
                Heading {level}
              </p>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 24, width: SHEET.column, maxWidth: "100%", fontSize: SHEET.name }}>
            {GLYPHS.map((glyphs) => (
              <p key={glyphs} style={{ margin: 0, overflowWrap: "anywhere" }}>
                {glyphs}
              </p>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export const Typography = () => {
  const names = useResolvedFontNames()

  return (
    <Sheet gap={SHEET.groups}>
      {FONT_FAMILIES.map((fam) => (
        <Specimen key={fam.token} label={fam.label} token={fam.token} name={names[fam.token] ?? ""} />
      ))}
    </Sheet>
  )
}
