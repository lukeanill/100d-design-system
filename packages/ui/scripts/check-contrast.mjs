// Fails when a theme's contrast drops below the rules the studio shows live.
//
// Both this and the /themes UI import CONTRAST_RULES from tokens/lib/color.mjs,
// so a theme that looks green in the studio is green in CI.
//
// The palette predates any contrast checking, so a strict gate would fail on
// day one. Today's shortfalls are recorded in .contrast-baseline.json; this
// fails only on NEW ones, or on a baselined pair getting worse. Fix a theme,
// then rerun with --update-baseline to lock the improvement in.
//
//   pnpm tokens:check
//   pnpm tokens:check --update-baseline

import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { CONTRAST_RULES, contrast, resolve } from "../tokens/lib/color.mjs"

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const TOKENS = join(root, "tokens")
const BASELINE_FILE = join(TOKENS, ".contrast-baseline.json")
const TOLERANCE = 0.02

const themeFiles = () =>
  readdirSync(TOKENS)
    .filter((f) => f.endsWith(".json") && !f.startsWith("."))
    .filter((f) => JSON.parse(readFileSync(join(TOKENS, f), "utf8")).tokens)

const baseline = existsSync(BASELINE_FILE) ? JSON.parse(readFileSync(BASELINE_FILE, "utf8")) : {}
const updating = process.argv.includes("--update-baseline")
// --warn: report, never fail. The studio uses this so saving a theme surfaces
// contrast problems without the write itself erroring.
const warnOnly = process.argv.includes("--warn")
const nextBaseline = {}

let failures = 0
let held = 0
let improved = 0

for (const file of themeFiles()) {
  const theme = JSON.parse(readFileSync(join(TOKENS, file), "utf8"))
  for (const rule of CONTRAST_RULES) {
    const fg = resolve(theme.tokens, rule.fg)
    const bg = resolve(theme.tokens, rule.bg)
    if (!fg || !bg) continue

    const ratio = Number(contrast(fg, bg).toFixed(2))
    const pair = `${rule.fg}|${rule.bg}`
    const label = `${theme.name}:${pair}`
    const known = baseline[theme.name]?.[pair]

    if (ratio >= rule.min) {
      if (known !== undefined && !updating) {
        improved++
        console.log(`  fixed  ${label.padEnd(48)} ${ratio.toFixed(2)} — rerun with --update-baseline to lock in`)
      }
      continue
    }

    ;(nextBaseline[theme.name] ??= {})[pair] = ratio
    if (known === undefined) {
      failures++
      console.error(`  NEW    ${label.padEnd(48)} ${ratio.toFixed(2)} < ${rule.min}  (${rule.label})`)
    } else if (ratio < known - TOLERANCE) {
      failures++
      console.error(`  WORSE  ${label.padEnd(48)} ${ratio.toFixed(2)} < baseline ${known.toFixed(2)}`)
    } else {
      held++
    }
  }
}

const themes = themeFiles().length
if (updating) {
  writeFileSync(BASELINE_FILE, JSON.stringify(nextBaseline, null, 2) + "\n")
  const total = Object.values(nextBaseline).reduce((n, o) => n + Object.keys(o).length, 0)
  console.log(`baseline updated: ${total} known shortfall(s) across ${themes} themes`)
  process.exit(0)
}
if (failures && warnOnly) {
  console.log(`\n${failures} contrast problem(s) — not blocking the save.`)
  process.exit(0)
}
if (failures) {
  console.error(
    `\n${failures} new or worsened contrast failure(s).` +
      `\nFix the pair, or accept it with \`pnpm tokens:check --update-baseline\`.`
  )
  process.exit(1)
}
console.log(
  `contrast ok: ${themes} themes, ${CONTRAST_RULES.length} rules each` +
    `${held ? `, ${held} known shortfall(s) held at baseline` : ""}` +
    `${improved ? `, ${improved} improved` : ""}`
)
