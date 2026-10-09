import * as React from "react"

import lightenUp from "../../tokens/lighten-up.json"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table"

/**
 * Every token in the design system on one page: colour, gradients, type, radius
 * and shadows, each as the active theme resolves it. The names come from a
 * theme file's own token list, so a token added there appears here; the values
 * are read off the page, so switching theme in the toolbar changes them.
 */

const TOKENS = (lightenUp as { tokens: Record<string, string> }).tokens
const NAMES = Object.keys(TOKENS)

const isGradient = (name: string) => name.startsWith("gradient-")
const isShadow = (name: string) => name === "shadow" || name.startsWith("shadow-")
const isRadius = (name: string) => name.startsWith("radius")
const isColour = (name: string) => !isGradient(name) && !isShadow(name) && !isRadius(name) && !name.startsWith("font-")

const COLOURS = NAMES.filter(isColour)
const GRADIENTS = NAMES.filter(isGradient)
const RADII = NAMES.filter(isRadius)
const SHADOWS = NAMES.filter(isShadow)

const TYPE_STYLES = [
  { label: "h1", tag: "h1" },
  { label: "h2", tag: "h2" },
  { label: "h3", tag: "h3" },
  { label: "h4", tag: "h4" },
  { label: "h5", tag: "h5" },
  { label: "h6", tag: "h6" },
  { label: "body large", className: "text-body-lg" },
  { label: "body", className: "text-body" },
  { label: "body small", className: "text-body-small" },
  { label: "footnote", className: "text-footnote" },
] as const

/** Bumps whenever the page's theme changes, so values are read again. */
function useThemeVersion() {
  const [version, setVersion] = React.useState(0)
  React.useEffect(() => {
    const observer = new MutationObserver(() => setVersion((v) => v + 1))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-font-theme", "style"] })
    return () => observer.disconnect()
  }, [])
  return version
}

/** A computed colour as `#RRGGBB`, through a canvas so any colour space works. */
function toHex(colour: string) {
  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = 1
  const ctx = canvas.getContext("2d")
  if (!ctx) return ""
  ctx.fillStyle = colour
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  return "#" + [r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("").toUpperCase()
}

type Colour = { name: string; hex: string; value: string }

function readColours(): Colour[] {
  const probe = document.createElement("div")
  probe.style.display = "none"
  document.body.appendChild(probe)
  const rows = COLOURS.map((name) => {
    probe.style.background = `var(--${name})`
    const computed = getComputedStyle(probe).backgroundColor
    // oklch stays oklch; anything the browser has mixed comes back in its own space
    return { name, hex: toHex(computed), value: computed.replace(/^color\(srgb /, "srgb(") }
  })
  probe.remove()
  return rows
}

type Type = { label: string; font: string; size: string; weight: string; lineHeight: string; spacing: string }

function readType(): Type[] {
  const host = document.createElement("div")
  host.style.display = "none"
  document.body.appendChild(host)
  const rows = TYPE_STYLES.map((style) => {
    const el = document.createElement("tag" in style ? style.tag : "p")
    if ("className" in style) el.className = style.className
    host.appendChild(el)
    const css = getComputedStyle(el)
    const size = parseFloat(css.fontSize)
    const line = parseFloat(css.lineHeight)
    return {
      label: style.label,
      font: css.fontFamily.split(",")[0].replace(/^["']|["']$/g, ""),
      size: `${size}px`,
      weight: css.fontWeight,
      lineHeight: Number.isFinite(line) && size ? String(Math.round((line / size) * 100) / 100) : css.lineHeight,
      spacing: css.letterSpacing === "normal" ? "0" : css.letterSpacing,
    }
  })
  host.remove()
  return rows
}

function readRoot(names: string[]) {
  const css = getComputedStyle(document.documentElement)
  return names.map((name) => ({ name, value: css.getPropertyValue(`--${name}`).trim() }))
}

/** Text on the page is the Body style (`text-body`), so its size follows the token. */
const PAGE: React.CSSProperties = { color: "var(--foreground)" }

const RULE = "1px solid var(--foreground)"

const HEADING: React.CSSProperties = {
  fontFamily: "var(--font-heading)",
  fontSize: "var(--h4-size, 48px)",
  fontWeight: 300,
  lineHeight: 1.2,
  margin: 0,
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ padding: "48px 0", borderBottom: RULE }}>
    <h2 style={HEADING}>{title}</h2>
    <div style={{ marginTop: 32 }}>{children}</div>
  </section>
)

/** The sheet has no row rules, no hover and no cell padding: only the section rule. */
/**
 * Inline styles rather than utility classes: this file is not scanned for them,
 * so they would never be generated, and the Table's own padding would win.
 */
const ROW: React.CSSProperties = { border: 0, background: "transparent" }
const CELL: React.CSSProperties = { padding: "12px 24px 12px 0", verticalAlign: "top", whiteSpace: "normal", overflowWrap: "anywhere" }
const NOWRAP: React.CSSProperties = { ...CELL, whiteSpace: "nowrap" }
const HEAD: React.CSSProperties = { height: "auto", padding: "0 24px 12px 0", fontWeight: 400, opacity: 0.5 }

const Name = ({ children }: { children: React.ReactNode }) => <span style={{ fontWeight: 700 }}>{children}</span>

/** A token name and its values: the tables below are all this shape. */
type Row = { name: string; cells: React.ReactNode[] }

/** Two token lists side by side, each name / hex / value, reading down the left then the right. */
function PairedTable({ rows, columns }: { rows: Row[]; columns: string[] }) {
  const half = Math.ceil(rows.length / 2)
  const left = rows.slice(0, half)
  const right = rows.slice(half)
  const group = (row?: Row) =>
    row ? (
      <>
        <TableCell style={CELL}>
          <Name>{row.name}</Name>
        </TableCell>
        {row.cells.map((cell, i) => (
          <TableCell key={i} style={i === 0 ? NOWRAP : CELL}>
            {cell}
          </TableCell>
        ))}
      </>
    ) : (
      <TableCell style={CELL} colSpan={columns.length + 1} />
    )

  return (
    <Table className="text-body">
      <TableBody>
        {left.map((row, i) => (
          <TableRow key={row.name} style={ROW}>
            {group(row)}
            <TableCell style={{ ...CELL, width: 48, padding: 0 }} />
            {group(right[i])}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

/** One token per row: its name, then its value across the rest. */
function ValueTable({ rows }: { rows: Row[] }) {
  return (
    <Table className="text-body">
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.name} style={ROW}>
            <TableCell style={{ ...CELL, width: "25%" }}>
              <Name>{row.name}</Name>
            </TableCell>
            <TableCell style={CELL}>{row.cells[0]}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default { title: "Tokens/All Tokens", parameters: { layout: "fullscreen" } }

export const AllTokens = () => {
  const version = useThemeVersion()
  const [state, setState] = React.useState<{ colours: Colour[]; type: Type[]; gradients: ReturnType<typeof readRoot>; radii: ReturnType<typeof readRoot>; shadows: ReturnType<typeof readRoot> }>()

  React.useEffect(() => {
    // a frame later, so the theme class that changed has been applied
    const id = requestAnimationFrame(() =>
      setState({
        colours: readColours(),
        type: readType(),
        gradients: readRoot(GRADIENTS),
        radii: readRoot(RADII),
        shadows: readRoot(SHADOWS),
      })
    )
    return () => cancelAnimationFrame(id)
  }, [version])

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="text-body" style={{ ...PAGE, maxWidth: 1440, margin: "0 auto", padding: "48px 80px 160px" }}>
        {state && (
          <>
            <Section title="Color">
              <PairedTable
                columns={["hex", "value"]}
                rows={state.colours.map((c) => ({ name: c.name, cells: [c.hex, c.value] }))}
              />
            </Section>

            <Section title="Gradients">
              <ValueTable rows={state.gradients.map((g) => ({ name: g.name.replace("gradient-", ""), cells: [g.value] }))} />
            </Section>

            <Section title="Typography">
              <Table className="text-body">
                <TableHeader>
                  <TableRow style={ROW}>
                    {["", "font name", "font size", "font weight", "line height", "letter spacing"].map((heading) => (
                      <TableHead key={heading || "style"} style={HEAD}>
                        {heading}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {state.type.map((t) => (
                    <TableRow key={t.label} style={ROW}>
                      <TableCell style={CELL}>
                        <Name>{t.label}</Name>
                      </TableCell>
                      <TableCell style={CELL}>{t.font}</TableCell>
                      <TableCell style={CELL}>{t.size}</TableCell>
                      <TableCell style={CELL}>{t.weight}</TableCell>
                      <TableCell style={CELL}>{t.lineHeight}</TableCell>
                      <TableCell style={CELL}>{t.spacing}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Section>

            <Section title="Radius">
              <ValueTable rows={state.radii.map((r) => ({ name: r.name, cells: [r.value] }))} />
            </Section>

            <Section title="Shadows">
              <ValueTable rows={state.shadows.map((s) => ({ name: s.name, cells: [s.value] }))} />
            </Section>
          </>
        )}
      </div>
    </div>
  )
}
