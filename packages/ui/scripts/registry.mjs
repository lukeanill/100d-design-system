// Reads and edits the two registries the app renders from:
//   src/lib/theme-registry.ts       — colour themes (id, label, fontTheme)
//   src/lib/font-theme-registry.ts  — font pairings (id, label, primaryFont, secondaryFont)
//
// These are hand-written TypeScript that other code imports types from, so we
// edit the array literals in place rather than generating the files.

import { readFileSync, writeFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const LIB = join(dirname(dirname(fileURLToPath(import.meta.url))), "src/lib")
export const COLOR_REGISTRY = join(LIB, "theme-registry.ts")
export const FONT_REGISTRY = join(LIB, "font-theme-registry.ts")

const entries = (source, arrayName) => {
  const body = new RegExp(`${arrayName}[^=]*=\\s*\\[([\\s\\S]*?)\\n\\]`).exec(source)?.[1] ?? ""
  return [...body.matchAll(/\{([^}]*)\}/g)].map((m) => {
    const fields = {}
    for (const [, key, value] of m[1].matchAll(/(\w+)\s*:\s*"([^"]*)"/g)) fields[key] = value
    return fields
  })
}

export const readColorThemes = () => entries(readFileSync(COLOR_REGISTRY, "utf8"), "colorThemes")
export const readFontThemes = () => entries(readFileSync(FONT_REGISTRY, "utf8"), "fontThemes")

const colorLine = ({ id, label, fontTheme }) =>
  `  { id: "${id}", label: "${label}", fontTheme: "${fontTheme}" },`

const fontLine = ({ id, label, primaryFont, secondaryFont }) =>
  `  { id: "${id}", label: "${label}", primaryFont: "${primaryFont}", secondaryFont: "${secondaryFont}" },`

const rewrite = (file, arrayName, lines) => {
  const source = readFileSync(file, "utf8")
  const match = new RegExp(`(${arrayName}[^=]*=\\s*\\[)([\\s\\S]*?)(\\n\\])`).exec(source)
  if (!match) throw new Error(`could not find ${arrayName} in ${file}`)
  writeFileSync(file, source.replace(match[0], `${match[1]}\n${lines.join("\n")}${match[3]}`))
}

/** Add or update a colour theme, preserving registry order for existing ids. */
export function upsertColorTheme({ id, label, fontTheme }) {
  const themes = readColorThemes()
  const index = themes.findIndex((t) => t.id === id)
  const entry = { id, label, fontTheme: fontTheme ?? themes[index]?.fontTheme ?? id }
  if (index === -1) themes.push(entry)
  else themes[index] = { ...themes[index], ...entry }
  rewrite(COLOR_REGISTRY, "colorThemes", themes.map(colorLine))
  return entry
}

export function removeColorTheme(id) {
  rewrite(
    COLOR_REGISTRY,
    "colorThemes",
    readColorThemes().filter((t) => t.id !== id).map(colorLine)
  )
}

/** Font pairings carry a union type that has to grow alongside the array. */
export function upsertFontTheme({ id, label, primaryFont, secondaryFont }) {
  const themes = readFontThemes()
  const index = themes.findIndex((t) => t.id === id)
  const entry = { id, label, primaryFont, secondaryFont }
  if (index === -1) themes.push(entry)
  else themes[index] = { ...themes[index], ...entry }
  rewrite(FONT_REGISTRY, "fontThemes", themes.map(fontLine))

  const source = readFileSync(FONT_REGISTRY, "utf8")
  if (!source.includes(`| "${id}"`)) {
    writeFileSync(
      FONT_REGISTRY,
      source.replace(/(export type FontThemeId =[\s\S]*?)(\n\n)/, `$1\n  | "${id}"$2`)
    )
  }
  return entry
}

export function removeFontTheme(id) {
  rewrite(
    FONT_REGISTRY,
    "fontThemes",
    readFontThemes().filter((t) => t.id !== id).map(fontLine)
  )
  const source = readFileSync(FONT_REGISTRY, "utf8")
  writeFileSync(FONT_REGISTRY, source.replace(new RegExp(`\\n\\s*\\| "${id}"`), ""))
}
