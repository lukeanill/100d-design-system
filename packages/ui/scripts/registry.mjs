// Reads and edits the two registries the app renders from:
//   src/lib/theme-registry.ts       — colour themes (id, label, fontTheme)
//   src/lib/font-theme-registry.ts  — font pairings (id, label, primaryFont, secondaryFont)
//
// The edits themselves live in core/registry-core.mjs, which is pure so the
// hosted studio's API can reuse it. This file is the filesystem wrapper.

import { readFileSync, writeFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import {
  readColorThemesFrom,
  readFontThemesFrom,
  removeColorThemeIn,
  removeFontThemeIn,
  upsertColorThemeIn,
  upsertFontThemeIn,
} from "./core/registry-core.mjs"

const LIB = join(dirname(dirname(fileURLToPath(import.meta.url))), "src/lib")
export const COLOR_REGISTRY = join(LIB, "theme-registry.ts")
export const FONT_REGISTRY = join(LIB, "font-theme-registry.ts")

const read = (file) => readFileSync(file, "utf8")

export const readColorThemes = () => readColorThemesFrom(read(COLOR_REGISTRY))
export const readFontThemes = () => readFontThemesFrom(read(FONT_REGISTRY))

export function upsertColorTheme(entry) {
  const { source, entry: saved } = upsertColorThemeIn(read(COLOR_REGISTRY), entry)
  writeFileSync(COLOR_REGISTRY, source)
  return saved
}

export function removeColorTheme(id) {
  writeFileSync(COLOR_REGISTRY, removeColorThemeIn(read(COLOR_REGISTRY), id))
}

export function upsertFontTheme(entry) {
  const { source, entry: saved } = upsertFontThemeIn(read(FONT_REGISTRY), entry)
  writeFileSync(FONT_REGISTRY, source)
  return saved
}

export function removeFontTheme(id) {
  writeFileSync(FONT_REGISTRY, removeFontThemeIn(read(FONT_REGISTRY), id))
}
