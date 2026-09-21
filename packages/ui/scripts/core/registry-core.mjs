// Pure registry edits: source string in, source string out, no filesystem.
//
// The two registries the app renders from are hand-written TypeScript that
// other code imports types from, so we edit the array literals in place rather
// than generating the files. Extracted from registry.mjs so the hosted studio's
// API can make the same edits without a writable disk.

const entries = (source, arrayName) => {
  const body = new RegExp(`${arrayName}[^=]*=\\s*\\[([\\s\\S]*?)\\n\\]`).exec(source)?.[1] ?? ""
  return [...body.matchAll(/\{([^}]*)\}/g)].map((m) => {
    const fields = {}
    for (const [, key, value] of m[1].matchAll(/(\w+)\s*:\s*"([^"]*)"/g)) fields[key] = value
    return fields
  })
}

export const readColorThemesFrom = (source) => entries(source, "colorThemes")
export const readFontThemesFrom = (source) => entries(source, "fontThemes")

const colorLine = ({ id, label, fontTheme }) =>
  `  { id: "${id}", label: "${label}", fontTheme: "${fontTheme}" },`

const fontLine = ({ id, label, primaryFont, secondaryFont }) =>
  `  { id: "${id}", label: "${label}", primaryFont: "${primaryFont}", secondaryFont: "${secondaryFont}" },`

const rewrite = (source, arrayName, lines) => {
  const match = new RegExp(`(${arrayName}[^=]*=\\s*\\[)([\\s\\S]*?)(\\n\\])`).exec(source)
  if (!match) throw new Error(`could not find ${arrayName} in registry source`)
  return source.replace(match[0], `${match[1]}\n${lines.join("\n")}${match[3]}`)
}

/** Add or update a colour theme, preserving registry order for existing ids. */
export function upsertColorThemeIn(source, { id, label, fontTheme }) {
  const themes = readColorThemesFrom(source)
  const index = themes.findIndex((t) => t.id === id)
  const entry = { id, label, fontTheme: fontTheme ?? themes[index]?.fontTheme ?? id }
  if (index === -1) themes.push(entry)
  else themes[index] = { ...themes[index], ...entry }
  return { source: rewrite(source, "colorThemes", themes.map(colorLine)), entry }
}

export function removeColorThemeIn(source, id) {
  return rewrite(
    source,
    "colorThemes",
    readColorThemesFrom(source).filter((t) => t.id !== id).map(colorLine)
  )
}

/** Font pairings carry a union type that has to grow alongside the array. */
export function upsertFontThemeIn(source, { id, label, primaryFont, secondaryFont }) {
  const themes = readFontThemesFrom(source)
  const index = themes.findIndex((t) => t.id === id)
  const entry = { id, label, primaryFont, secondaryFont }
  if (index === -1) themes.push(entry)
  else themes[index] = { ...themes[index], ...entry }

  let next = rewrite(source, "fontThemes", themes.map(fontLine))
  if (!next.includes(`| "${id}"`)) {
    next = next.replace(/(export type FontThemeId =[\s\S]*?)(\n\n)/, `$1\n  | "${id}"$2`)
  }
  return { source: next, entry }
}

export function removeFontThemeIn(source, id) {
  const next = rewrite(
    source,
    "fontThemes",
    readFontThemesFrom(source).filter((t) => t.id !== id).map(fontLine)
  )
  return next.replace(new RegExp(`\\n\\s*\\| "${id}"`), "")
}
