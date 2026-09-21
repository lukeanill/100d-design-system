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
// The scoring lives in core/contrast-core.mjs so the hosted studio's API can
// run this same gate before it commits.
//
//   pnpm tokens:check
//   pnpm tokens:check --update-baseline

import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { evaluateContrast, describeFailure } from "./core/contrast-core.mjs"

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const TOKENS = join(root, "tokens")
const BASELINE_FILE = join(TOKENS, ".contrast-baseline.json")

const themes = readdirSync(TOKENS)
  .filter((f) => f.endsWith(".json") && !f.startsWith("."))
  .map((f) => JSON.parse(readFileSync(join(TOKENS, f), "utf8")))

const baseline = existsSync(BASELINE_FILE) ? JSON.parse(readFileSync(BASELINE_FILE, "utf8")) : {}
const updating = process.argv.includes("--update-baseline")
// --warn: report, never fail. The studio uses this so saving a theme surfaces
// contrast problems without the write itself erroring.
const warnOnly = process.argv.includes("--warn")

const report = evaluateContrast(themes, baseline)

if (!updating) {
  for (const i of report.improvements) {
    console.log(
      `  fixed  ${`${i.theme}:${i.pair}`.padEnd(48)} ${i.ratio.toFixed(2)} — rerun with --update-baseline to lock in`
    )
  }
}
for (const f of report.failures) {
  const tag = f.kind === "new" ? "NEW   " : "WORSE "
  console.error(`  ${tag} ${describeFailure(f)}`)
}

const failures = report.failures.length

if (updating) {
  writeFileSync(BASELINE_FILE, JSON.stringify(report.nextBaseline, null, 2) + "\n")
  const total = Object.values(report.nextBaseline).reduce((n, o) => n + Object.keys(o).length, 0)
  console.log(`baseline updated: ${total} known shortfall(s) across ${report.themeCount} themes`)
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
  `contrast ok: ${report.themeCount} themes, ${report.ruleCount} rules each` +
    `${report.held ? `, ${report.held} known shortfall(s) held at baseline` : ""}` +
    `${report.improved ? `, ${report.improved} improved` : ""}`
)
