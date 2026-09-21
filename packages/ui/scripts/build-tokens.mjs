// Generates the theme blocks in src/styles/tokens.css from tokens/*.json.
//
// Values pass through as written, so anything already in oklch() stays exact.
// Plain hex ("#BA4255" or "BA4255") is converted to oklch on the way out, which
// is what lets you paste values straight from the design tool.
//
//   pnpm tokens:build          write tokens.css
//   pnpm tokens:build --check  fail if tokens.css is out of date (used in CI)
//
// The rendering itself lives in core/tokens-core.mjs, which has no filesystem
// access so the hosted studio's API can produce the same bytes. This file is
// the filesystem wrapper around it.

import { readFileSync, writeFileSync, readdirSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { renderTokensCss, sortThemes } from "./core/tokens-core.mjs"

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const TOKENS_DIR = join(root, "tokens")
const CSS = join(root, "src/styles/tokens.css")

export function loadThemes() {
  const files = readdirSync(TOKENS_DIR).filter((f) => f.endsWith(".json") && !f.startsWith("."))
  return sortThemes(files.map((f) => JSON.parse(readFileSync(join(TOKENS_DIR, f), "utf8"))))
}

// only act when run as a script — importing this module must not rewrite the CSS
const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]
if (isMain) {
  const css = readFileSync(CSS, "utf8")
  const themes = loadThemes()
  const next = renderTokensCss(css, themes)

  if (process.argv.includes("--check")) {
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
}
