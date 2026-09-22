// Pure token rendering: strings and objects in, strings out, no filesystem.
//
// Extracted from build-tokens.mjs so the same code can run in three places:
// the CLI, the dev server's studio API, and the serverless API behind the
// hosted studio. A theme saved online and a theme saved locally therefore
// produce byte-identical CSS.

import { fmt, hexToOklch } from "../../tokens/lib/color.mjs"

// Themes appear in the CSS in this order; anything else is appended alphabetically.
export const ORDER = [
  "light", "dark", "electric-pulse", "acid-forest", "carbon-mint",
  "solar-azul", "arctic-aurora", "strawberry-matcha", "metallic-mist",
]

export const START = "/* @tokens:start"
export const END = "/* @tokens:end */"
export const FONTS_START = "/* @tokens:fonts:start"
export const FONTS_END = "/* @tokens:fonts:end */"

// "#BA4255", "#fff" or a bare "BA4255" — but never a plain number like "400",
// which is a valid hex string and also a valid font weight.
const isHex = (v) => {
  const t = v.trim()
  if (/^#[0-9a-fA-F]{3}$|^#[0-9a-fA-F]{6}$/.test(t)) return true
  return /^[0-9a-fA-F]{6}$/.test(t) && /[a-fA-F]/.test(t)
}
const render = (v) => (isHex(v) ? fmt(hexToOklch(v)) : v)

/** CSS order, which is not the studio's display order (that is `theme.order`). */
export function sortThemes(themes) {
  return [...themes].sort((a, b) => {
    const ai = ORDER.indexOf(a.name)
    const bi = ORDER.indexOf(b.name)
    if (ai === -1 && bi === -1) return a.name.localeCompare(b.name)
    if (ai === -1) return 1
    if (bi === -1) return -1
    return ai - bi
  })
}

/**
 * What each role falls back to: sans for primary and body, serif for emphasis.
 *
 * This is both the tail of every font stack and the whole value when no family
 * is named. A role left empty used to emit no declaration at all, which left
 * the token undefined and the text rendering in whatever happened to be
 * inherited — a theme with a blank font slot should still be a complete theme.
 */
const SYSTEM_FONT = {
  primary: "ui-sans-serif, system-ui, sans-serif",
  emphasis: "ui-serif, Georgia, serif",
  body: "ui-sans-serif, system-ui, sans-serif",
}

const FONT_ROLES = ["primary", "emphasis", "body"]

function block({ selector, tokens, extra = [], fonts, fontSource }) {
  const lines = []
  // Themes paired to bundled faces are styled by their [data-font-theme] block,
  // so their `fonts` are studio metadata only. Google themes declare theirs here.
  if (fontSource === "google") {
    for (const role of FONT_ROLES) {
      const family = fonts?.[role]?.trim()
      const name = role === "body" ? "font-body-token" : `font-${role}`
      // every role is declared whether or not a family was named, so the stack
      // always ends somewhere real
      lines.push(`  --${name}: ${family ? `'${family}', ` : ""}${SYSTEM_FONT[role]};`)
    }
  }
  for (const [name, value] of Object.entries(tokens)) {
    // keep the shadow group visually separated, as the handwritten file had it
    if (name === "shadow-2xs") lines.push("")
    lines.push(`  --${name}: ${render(value)};`)
  }
  for (const decl of extra) {
    lines.push("")
    lines.push(`  ${decl}`)
  }
  return `${selector} {\n${lines.join("\n")}\n}\n`
}

/** @import lines for every Google family named by a theme, deduped and sorted. */
function fontImports(themes) {
  const families = new Set()
  for (const theme of themes) {
    if (theme.fontSource !== "google") continue
    for (const family of Object.values(theme.fonts ?? {})) {
      if (family) families.add(family)
    }
  }
  return [...families]
    .sort()
    .map(
      (family) =>
        `@import url("https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@300;400;500;700&display=swap");`
    )
    .join("\n")
}

/**
 * Rewrite the generated blocks of tokens.css from the given themes.
 * `css` is the current file; the return value is the file it should become.
 */
export function renderTokensCss(css, themes) {
  const sorted = sortThemes(themes)

  const from = css.indexOf(START)
  const to = css.indexOf(END)
  if (from === -1 || to === -1) throw new Error("tokens.css markers not found")

  const header = css.slice(from, css.indexOf("*/", from) + 3)
  const generated = sorted.map(block).join("\n")
  let next = css.slice(0, from) + header + generated + css.slice(to)

  const fFrom = next.indexOf(FONTS_START)
  const fTo = next.indexOf(FONTS_END)
  if (fFrom !== -1 && fTo !== -1) {
    const fHeader = next.slice(fFrom, next.indexOf("*/", fFrom) + 3)
    const imports = fontImports(sorted)
    next = next.slice(0, fFrom) + fHeader + (imports ? "\n" + imports + "\n" : "\n") + next.slice(fTo)
  }
  return next
}
