// Reads and writes the studio's workspace on a real disk.
//
// The hosted studio has a GitHub-backed equivalent of this in api/themes.ts;
// both hand the same shape to applyThemeChange, which is what keeps a local
// save and an online save producing identical commits.

import { existsSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import {
  BASELINE,
  COLOR_REGISTRY,
  FONT_REGISTRY,
  TOKENS_CSS,
  TOKENS_DIR,
} from "./theme-change.mjs"

const read = (root, rel) => readFileSync(join(root, rel), "utf8")

export function readWorkspace(root) {
  const dir = join(root, TOKENS_DIR)
  const themes = {}
  for (const file of readdirSync(dir)) {
    if (!file.endsWith(".json") || file.startsWith(".")) continue
    const theme = JSON.parse(readFileSync(join(dir, file), "utf8"))
    themes[theme.name] = theme
  }
  const baselinePath = join(root, BASELINE)
  return {
    themes,
    tokensCss: read(root, TOKENS_CSS),
    colorRegistry: read(root, COLOR_REGISTRY),
    fontRegistry: read(root, FONT_REGISTRY),
    baseline: existsSync(baselinePath) ? JSON.parse(readFileSync(baselinePath, "utf8")) : {},
  }
}

export function writeFiles(root, files) {
  for (const [rel, content] of Object.entries(files)) {
    const target = join(root, rel)
    if (content === null) {
      if (existsSync(target)) unlinkSync(target)
    } else {
      writeFileSync(target, content)
    }
  }
}
