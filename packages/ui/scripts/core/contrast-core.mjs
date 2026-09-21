// Pure contrast evaluation: themes in, a structured report out, no filesystem.
//
// Extracted from check-contrast.mjs so the hosted studio's API can run the
// exact gate CI runs *before* committing. Without that, a theme saved online
// with a new contrast failure would commit cleanly, fail CI, and never reach
// the site — a silent no-op from the designer's point of view.

import { CONTRAST_RULES, contrast, resolve } from "../../tokens/lib/color.mjs"

export const TOLERANCE = 0.02

/**
 * @param themes   theme objects (those without `tokens` are skipped, as the CLI does)
 * @param baseline the recorded shortfalls from tokens/.contrast-baseline.json
 * @returns {{ failures, held, improved, nextBaseline, themeCount, ruleCount }}
 *          `failures` are NEW or WORSENED pairs — the ones CI fails on.
 */
export function evaluateContrast(themes, baseline = {}) {
  const scored = themes.filter((t) => t.tokens)
  const failures = []
  const improvements = []
  const nextBaseline = {}
  let held = 0

  for (const theme of scored) {
    for (const rule of CONTRAST_RULES) {
      const fg = resolve(theme.tokens, rule.fg)
      const bg = resolve(theme.tokens, rule.bg)
      if (!fg || !bg) continue

      const ratio = Number(contrast(fg, bg).toFixed(2))
      const pair = `${rule.fg}|${rule.bg}`
      const known = baseline[theme.name]?.[pair]

      if (ratio >= rule.min) {
        if (known !== undefined) improvements.push({ theme: theme.name, pair, ratio })
        continue
      }

      ;(nextBaseline[theme.name] ??= {})[pair] = ratio
      if (known === undefined) {
        failures.push({ theme: theme.name, pair, ratio, min: rule.min, label: rule.label, kind: "new" })
      } else if (ratio < known - TOLERANCE) {
        failures.push({ theme: theme.name, pair, ratio, baseline: known, kind: "worse" })
      } else {
        held++
      }
    }
  }

  return {
    failures,
    improvements,
    improved: improvements.length,
    held,
    nextBaseline,
    themeCount: scored.length,
    ruleCount: CONTRAST_RULES.length,
  }
}

/** One human-readable line per failure — shown in the studio and in CI. */
export function describeFailure(f) {
  const label = `${f.theme}:${f.pair}`
  return f.kind === "new"
    ? `${label} ${f.ratio.toFixed(2)} < ${f.min} (${f.label})`
    : `${label} ${f.ratio.toFixed(2)} < baseline ${f.baseline.toFixed(2)}`
}

/** The one-line summary both studio APIs return to the UI. */
export function formatContrast(report) {
  if (!report) return null
  if (!report.failures.length) {
    return `Contrast ok: ${report.themeCount} themes, ${report.ruleCount} rules each` +
      `${report.held ? `, ${report.held} known shortfall(s) held at baseline` : ""}.`
  }
  return (
    `${report.failures.length} contrast problem(s):\n` +
    report.failures.map((f) => `  ${describeFailure(f)}`).join("\n")
  )
}
