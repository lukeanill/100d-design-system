// Generates the theme blocks in src/styles/tokens.css from tokens/*.json.
//
// Values pass through as written, so anything already in oklch() stays exact.
// Plain hex ("#BA4255" or "BA4255") is converted to oklch on the way out, which
// is what lets you paste values straight from the design tool.
//
//   pnpm tokens:build          write tokens.css
//   pnpm tokens:build --check  fail if tokens.css is out of date (used in CI)

import { readFileSync, writeFileSync, readdirSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { fmt, hexToOklch } from "../tokens/lib/color.mjs"

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const TOKENS_DIR = join(root, "tokens")
const CSS = join(root, "src/styles/tokens.css")
const START = "/* @tokens:start"
const END = "/* @tokens:end */"
const FONTS_START = "/* @tokens:fonts:start"
const FONTS_END = "/* @tokens:fonts:end */"

// Themes appear in the CSS in this order; anything else is appended alphabetically.
const ORDER = [
  "light", "dark", "electric-pulse", "acid-forest", "carbon-mint",
  "solar-violet", "arctic-aurora", "strawberry-matcha", "metallic-mist",
]

// "#BA4255", "#fff" or a bare "BA4255" — but never a plain number like "400",
// which is a valid hex string and also a valid font weight.
const isHex = (v) => {
  const t = v.trim()
  if (/^#[0-9a-fA-F]{3}$|^#[0-9a-fA-F]{6}$/.test(t)) return true
  return /^[0-9a-fA-F]{6}$/.test(t) && /[a-fA-F]/.test(t)
}
const render = (v) => (isHex(v) ? fmt(hexToOklch(v)) : v)

export function loadThemes() {
  const files = readdirSync(TOKENS_DIR).filter((f) => f.endsWith(".json") && !f.startsWith("."))
  const themes = files.map((f) => JSON.parse(readFileSync(join(TOKENS_DIR, f), "utf8")))
  return themes.sort((a, b) => {
    const ai = ORDER.indexOf(a.name)
    const bi = ORDER.indexOf(b.name)
    if (ai === -1 && bi === -1) return a.name.localeCompare(b.name)
    if (ai === -1) return 1
    if (bi === -1) return -1
    return ai - bi
  })
}

const FALLBACK = {
  heading: "ui-sans-serif, system-ui, sans-serif",
  body: "ui-sans-serif, system-ui, sans-serif",
  serif: "Georgia, serif",
}

function block({ selector, tokens, extra = [], fonts, fontSource }) {
  const lines = []
  // Themes paired to bundled faces are styled by their [data-font-theme] block,
  // so their `fonts` are studio metadata only. Google themes declare theirs here.
  if (fonts && fontSource === "google") {
    for (const [role, family] of Object.entries(fonts)) {
      if (!family) continue
      const name = role === "body" ? "font-body-token" : `font-${role}`
      lines.push(`  --${name}: '${family}', ${FALLBACK[role] ?? FALLBACK.body};`)
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

const FONT_START = "/* @tokens:fonts:start"
const FONT_END = "/* @tokens:fonts:end */"


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

const css = readFileSync(CSS, "utf8")
const from = css.indexOf(START)
const to = css.indexOf(END)
if (from === -1 || to === -1) throw new Error(`markers not found in ${CSS}`)

const header = css.slice(from, css.indexOf("*/", from) + 3)
const themes = loadThemes()
const generated = themes.map(block).join("\n")
let next = css.slice(0, from) + header + generated + css.slice(to)

const fFrom = next.indexOf(FONT_START)
const fTo = next.indexOf(FONT_END)
if (fFrom !== -1 && fTo !== -1) {
  const fHeader = next.slice(fFrom, next.indexOf("*/", fFrom) + 3)
  const imports = fontImports(themes)
  next = next.slice(0, fFrom) + fHeader + (imports ? "\n" + imports + "\n" : "\n") + next.slice(fTo)
}

// only act when run as a script — importing this module must not rewrite the CSS
const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]
if (!isMain) {
  // exported helpers only
} else if (process.argv.includes("--check")) {
  if (next !== css) {
    console.error(
      "tokens.css is out of date with tokens/*.json.\n" +
        "Run `pnpm --filter @workspace/ui tokens:build` and commit the result."
    )
    process.exit(1)
  }
  console.log(`tokens.css is up to date (${themes.length} themes)`)
} else {
  writeFileSync(CSS, next)
  console.log(`wrote ${themes.length} theme blocks to src/styles/tokens.css`)
}
