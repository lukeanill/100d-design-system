import { mkdirSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"

import { getDb } from "./db.ts"

type Rec = Record<string, string | number | null>

export const APP_URL = process.env.QA_APP_URL ?? "http://localhost:5174/qa"
const LOG_DIR = process.env.QA_LOGS ?? join(import.meta.dirname, "..", "logs")

export const logPath = (testId: number | string) => join(LOG_DIR, `test-${testId}.md`)

const cell = (text: string | number | null) => String(text ?? "").replaceAll("|", "\\|").replaceAll("\n", " ")

const stamp = (iso: string | null) => (iso ? new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) : "running");

/**
 * The test log as a document, built from the database so the two never disagree: the brief,
 * then each component with its states, the elements tested, what was expected, PASS or FAIL
 * and why, then the user's ratings and feedback. Claude Code rewrites it after every step.
 */
export function renderLog(testId: number | string): string {
  const db = getDb()
  const all = (sql: string, ...args: (string | number)[]) => db.prepare(sql).all(...args) as Rec[]
  const test = all("SELECT * FROM tests WHERE id = ?", testId)[0]
  if (!test) throw new Error(`No test ${testId}`)

  const components = all(
    `SELECT tc.*, r.rating FROM test_components tc
     JOIN components c ON c.path = tc.component_path
     LEFT JOIN ratings r ON r.test_id = tc.test_id AND r.component_path = tc.component_path
     WHERE tc.test_id = ? ORDER BY c.position`,
    testId,
  )
  const states = all("SELECT component_path p, state_name s FROM test_states WHERE test_id = ? ORDER BY rowid", testId)
  const checks = all("SELECT * FROM checks WHERE test_id = ? ORDER BY id", testId)
  const feedback = all("SELECT * FROM feedback WHERE test_id = ? ORDER BY id", testId)

  const taken =
    test.finished_at && test.started_at
      ? `${Math.max(1, Math.round((Date.parse(test.finished_at as string) - Date.parse(test.started_at as string)) / 60000))} min`
      : "running"

  const out: string[] = []
  out.push(`# Test ${testId}`, "")
  out.push("## Brief", "")
  out.push(`- Theme: ${test.theme}`)
  out.push(`- States: ${test.states_mode === "all" ? "All states" : "Default states"}`)
  out.push(`- Components: ${components.length}`)
  out.push(`- States to test: ${states.length}`)
  out.push(`- Started: ${stamp(test.started_at as string)}`)
  out.push(`- Estimate: ${test.estimate_minutes ?? "none given"}${test.estimate_minutes ? " min" : ""}`)
  out.push(`- Finished: ${stamp(test.finished_at as string | null)} (${taken})`)
  out.push(`- Results page: ${APP_URL}/results/${testId}`, "")

  for (const c of components) {
    const path = c.component_path as string
    out.push(`## ${path}`, "")
    if (c.excluded_reason) {
      out.push(`Excluded: ${c.excluded_reason}`, "")
    } else {
      const mine = checks.filter((k) => k.component_path === path)
      const fails = mine.filter((k) => k.outcome === "FAIL").length
      const grade = c.grade ? `Grade ${c.grade} (${fails} ${fails === 1 ? "issue" : "issues"})` : "Not finished"
      out.push(`${grade}. Your rating: ${c.rating ?? "not rated yet"}.`, "")
      if (c.summary) out.push(`${c.summary}`, "")
      const scenarioNames = [...new Set(mine.filter((k) => String(k.state_name).startsWith("scenario: ")).map((k) => k.state_name as string))]
      const sections = [...states.filter((x) => x.p === path).map((x) => x.s as string), ...scenarioNames]
      for (const stateName of sections) {
        const s = { s: stateName }
        out.push(`### ${s.s}`, "")
        const rows = mine.filter((k) => k.state_name === s.s)
        if (rows.length === 0) {
          out.push("_No elements listed yet._", "")
          continue
        }
        out.push("| Element | Expected | Outcome | Why it failed |", "| --- | --- | --- | --- |")
        for (const k of rows) out.push(`| ${cell(k.element)} | ${cell(k.expected)} | ${k.outcome ?? "pending"} | ${cell(k.fail_code)} |`)
        out.push("")
      }
    }
    const notes = feedback.filter((f) => f.component_path === path)
    if (notes.length) {
      out.push("**Your feedback**", "")
      for (const f of notes) out.push(`- ${f.state_name ? `${f.state_name}: ` : ""}${f.text}`)
      out.push("")
    }
  }

  const general = feedback.filter((f) => !f.component_path)
  if (general.length) {
    out.push("## Your feedback", "")
    for (const f of general) out.push(`- ${f.text}`)
    out.push("")
  }
  return out.join("\n")
}

/** Rewrites the log file and returns its path. */
export function writeLog(testId: number | string): string {
  const path = logPath(testId)
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, renderLog(testId))
  return path
}
