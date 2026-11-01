/**
 * What Claude Code runs to read and write the QA database. Every command that changes a test
 * rewrites its log, qa/logs/test-<id>.md.
 *
 *   node qa/server/cli.ts sync
 *   node qa/server/cli.ts components [--untested]
 *   node qa/server/cli.ts states <path> --json '[{"name":"default","default":true,"reason":"..."}]'
 *
 *   node qa/server/cli.ts begin --theme <id> --states defaults|all --components a,b [--estimate <minutes>]
 *   node qa/server/cli.ts replan <testId>
 *   node qa/server/cli.ts expect <testId> <path> --json '[{"state":"hover","element":"fill","expected":"--muted at 40%"}]'
 *   node qa/server/cli.ts check <testId> <path> --json '[{"state":"hover","element":"fill","outcome":"PASS"},{"state":"hover","element":"text","outcome":"FAIL","code":"not using theme token"}]'
 *   node qa/server/cli.ts result <testId> <path> --summary "..."
 *   node qa/server/cli.ts exclude <testId> <path> --reason "..."
 *   node qa/server/cli.ts finish <testId>
 *
 *   node qa/server/cli.ts feedback <testId> --text "..." [--component <path>] [--state <name>]
 *   node qa/server/cli.ts log <testId>
 */
import { parseArgs } from "node:util"

import { gradeFor } from "../shared/grade.ts"
import { getDb, now, transaction } from "./db.ts"
import { writeLog } from "./log.ts"
import { syncStorybook } from "./sync.ts"

const { positionals, values } = parseArgs({
  allowPositionals: true,
  options: {
    json: { type: "string" },
    theme: { type: "string" },
    states: { type: "string" },
    components: { type: "string" },
    overrides: { type: "string" },
    reason: { type: "string" },
    untested: { type: "boolean" },
    estimate: { type: "string" },
    summary: { type: "string" },
    text: { type: "string" },
    component: { type: "string" },
    state: { type: "string" },
  },
})

const [command, ...rest] = positionals
const db = getDb()

function fail(message: string): never {
  console.error(message)
  process.exit(1)
}

function requireComponent(path: string) {
  if (!db.prepare("SELECT 1 FROM components WHERE path = ?").get(path)) {
    fail(`Unknown component: ${path}. Run "sync" first, and use the path from "components".`)
  }
}

function requireSelected(testId: string, path: string) {
  const found = db.prepare("SELECT 1 FROM test_components WHERE test_id = ? AND component_path = ?").get(testId, path)
  if (!found) fail(`${path} was not selected for test ${testId}, so it is not part of this test.`)
}

function json<T>(): T {
  if (!values.json) fail("--json is required")
  return JSON.parse(values.json) as T
}

interface StateInput {
  name: string
  default?: boolean
  reason?: string
}

interface ExpectInput {
  state: string
  element: string
  expected: string
}

interface CheckInput {
  state: string
  element: string
  outcome: "PASS" | "FAIL"
  /** Why it failed, in a few words: "not using theme token". */
  code?: string
}

switch (command) {
  case "sync": {
    const result = await syncStorybook()
    if (!result.ok) fail(result.error)
    console.log(`${result.total} components. Added: ${result.added.length}. Removed: ${result.removed.length}.`)
    break
  }

  case "components": {
    const rows = db
      .prepare(
        `SELECT c.path, (SELECT COUNT(*) FROM states s WHERE s.component_path = c.path) AS states,
                (SELECT COUNT(*) FROM test_components t WHERE t.component_path = c.path) AS tests
         FROM components c WHERE c.present = 1 ORDER BY c.position`,
      )
      .all() as { path: string; states: number; tests: number }[]
    for (const r of rows) {
      if (values.untested && r.tests > 0) continue
      console.log(`${r.path}\tstates:${r.states}\ttests:${r.tests}`)
    }
    break
  }

  case "states": {
    const [path] = rest
    if (!path) fail("states <path> --json [...]")
    requireComponent(path)
    const states = json<StateInput[]>()
    transaction(() => {
      const upsert = db.prepare(
        `INSERT INTO states (component_path, name, is_default, reason) VALUES (?, ?, ?, ?)
         ON CONFLICT (component_path, name) DO UPDATE SET is_default = excluded.is_default, reason = excluded.reason`,
      )
      for (const s of states) upsert.run(path, s.name, s.default ? 1 : 0, s.reason ?? "")
      // the list replaces the set. Tests keep their own record of the states they ran, so
      // nothing here looks at, or changes, past tests
      const names = states.map((s) => s.name)
      db.prepare(`DELETE FROM states WHERE component_path = ? AND name NOT IN (${names.map(() => "?").join(",") || "''"})`).run(path, ...names)
    })
    console.log(`${states.length} states recorded for ${path}`)
    break
  }

  case "begin": {
    const { theme, states, components } = values
    if (!theme || !components || (states !== "defaults" && states !== "all")) {
      fail("begin --theme <id> --states defaults|all --components a,b [--estimate <minutes>]")
    }
    const paths = components.split(",").filter(Boolean)
    paths.forEach(requireComponent)
    // The states are known before a test starts; a component without any has to be given some first.
    const planned = new Map<string, string[]>()
    for (const path of paths) {
      const rows = db
        .prepare(`SELECT name FROM states WHERE component_path = ? ${states === "defaults" ? "AND is_default = 1" : ""} ORDER BY id`)
        .all(path) as { name: string }[]
      if (rows.length === 0) fail(`${path} has no ${states === "defaults" ? "default " : ""}states recorded. Identify its states first (the "states" command).`)
      planned.set(path, rows.map((r) => r.name))
    }
    const estimate = values.estimate ? Number(values.estimate) : null
    const id = transaction(() => {
      const result = db
        .prepare("INSERT INTO tests (started_at, theme, overrides, states_mode, estimate_minutes) VALUES (?, ?, ?, ?, ?)")
        .run(now(), theme, values.overrides ?? "{}", states, Number.isFinite(estimate) ? estimate : null)
      const testId = Number(result.lastInsertRowid)
      // the selection is the test: only these components can be graded or excluded in it
      const selected = db.prepare("INSERT INTO test_components (test_id, component_path) VALUES (?, ?)")
      const state = db.prepare("INSERT INTO test_states (test_id, component_path, state_name, issue_count) VALUES (?, ?, ?, 0)")
      for (const [path, names] of planned) {
        selected.run(testId, path)
        for (const name of names) state.run(testId, path, name)
      }
      return testId
    })
    console.log(`test ${id}`)
    console.log(`log: ${writeLog(id)}`)
    break
  }

  case "replan": {
    // Brings a test that has no results yet in line with the states now recorded for its components.
    const [testId] = rest
    if (!testId) fail("replan <testId>")
    const test = db.prepare("SELECT states_mode AS mode FROM tests WHERE id = ?").get(testId) as { mode: string } | undefined
    if (!test) fail(`No test ${testId}`)
    const done = db.prepare("SELECT component_path AS p FROM test_components WHERE test_id = ? AND (grade IS NOT NULL OR excluded_reason IS NOT NULL)").all(testId)
    if (done.length) fail(`Test ${testId} already has results for ${done.length} component(s); start a new test instead.`)
    const paths = (db.prepare("SELECT component_path AS p FROM test_components WHERE test_id = ?").all(testId) as { p: string }[]).map((r) => r.p)
    const plan = new Map<string, string[]>()
    for (const path of paths) {
      const rows = db
        .prepare(`SELECT name FROM states WHERE component_path = ? ${test.mode === "defaults" ? "AND is_default = 1" : ""} ORDER BY id`)
        .all(path) as { name: string }[]
      if (rows.length === 0) fail(`${path} has no states recorded.`)
      plan.set(path, rows.map((r) => r.name))
    }
    transaction(() => {
      db.prepare("DELETE FROM checks WHERE test_id = ?").run(testId)
      db.prepare("DELETE FROM test_states WHERE test_id = ?").run(testId)
      const state = db.prepare("INSERT INTO test_states (test_id, component_path, state_name, issue_count) VALUES (?, ?, ?, 0)")
      for (const [path, names] of plan) for (const name of names) state.run(testId, path, name)
    })
    for (const [path, names] of plan) console.log(`${path}: ${names.length} states`)
    console.log(`log: ${writeLog(testId)}`)
    break
  }

  case "expect": {
    const [testId, path] = rest
    if (!testId || !path) fail("expect <testId> <path> --json [...]")
    requireSelected(testId, path)
    const list = json<ExpectInput[]>()
    transaction(() => {
      const put = db.prepare(
        `INSERT INTO checks (test_id, component_path, state_name, element, expected) VALUES (?, ?, ?, ?, ?)
         ON CONFLICT (test_id, component_path, state_name, element) DO UPDATE SET expected = excluded.expected`,
      )
      for (const c of list) {
        // a scenario ("scenario: width full", "scenario: long text") sits beside the states, not among them
        const scenario = c.state.startsWith("scenario: ")
        if (!scenario && !db.prepare("SELECT 1 FROM test_states WHERE test_id = ? AND component_path = ? AND state_name = ?").get(testId, path, c.state)) {
          fail(`${c.state} is not a state of ${path} in test ${testId}.`)
        }
        put.run(testId, path, c.state, c.element, c.expected)
      }
    })
    console.log(`${list.length} elements listed for ${path}`)
    writeLog(testId)
    break
  }

  case "check": {
    const [testId, path] = rest
    if (!testId || !path) fail("check <testId> <path> --json [...]")
    requireSelected(testId, path)
    const list = json<CheckInput[]>()
    transaction(() => {
      const update = db.prepare(
        "UPDATE checks SET outcome = ?, fail_code = ? WHERE test_id = ? AND component_path = ? AND state_name = ? AND element = ?",
      )
      for (const c of list) {
        if (c.outcome !== "PASS" && c.outcome !== "FAIL") fail(`Outcome must be PASS or FAIL: ${c.state} / ${c.element}`)
        if (c.outcome === "FAIL" && !c.code) fail(`A FAIL needs a short reason (code): ${c.state} / ${c.element}`)
        const done = update.run(c.outcome, c.outcome === "FAIL" ? (c.code ?? "") : "", testId, path, c.state, c.element)
        if (done.changes === 0) fail(`${c.state} / ${c.element} was not listed with "expect" first.`)
      }
    })
    console.log(`${list.length} outcomes recorded for ${path}`)
    writeLog(testId)
    break
  }

  case "result": {
    const [testId, path] = rest
    if (!testId || !path || !values.summary) fail('result <testId> <path> --summary "..."')
    requireComponent(path)
    requireSelected(testId, path)
    const planned = (db.prepare("SELECT state_name AS s FROM test_states WHERE test_id = ? AND component_path = ?").all(testId, path) as { s: string }[]).map((r) => r.s)
    const checks = db.prepare("SELECT * FROM checks WHERE test_id = ? AND component_path = ?").all(testId, path) as {
      state_name: string
      element: string
      outcome: string | null
      fail_code: string
    }[]
    const untested = checks.filter((c) => !c.outcome).map((c) => `${c.state_name} / ${c.element}`)
    if (untested.length) fail(`Not tested yet: ${untested.join(", ")}`)
    const missing = planned.filter((s) => !checks.some((c) => c.state_name === s))
    if (missing.length) fail(`No elements listed for: ${missing.join(", ")}`)

    const fails = checks.filter((c) => c.outcome === "FAIL")
    const perState = new Map(planned.map((s) => [s, fails.filter((f) => f.state_name === s).length]))
    const withIssues = [...perState.values()].filter((n) => n > 0).length
    const grade = gradeFor(fails.length, withIssues, planned.length)
    transaction(() => {
      db.prepare("DELETE FROM issues WHERE test_id = ? AND component_path = ?").run(testId, path)
      db.prepare(
        `UPDATE test_components SET grade = ?, issue_count = ?, summary = ?, excluded_reason = NULL
         WHERE test_id = ? AND component_path = ?`,
      ).run(grade, fails.length, values.summary!, testId, path)
      const state = db.prepare("UPDATE test_states SET issue_count = ? WHERE test_id = ? AND component_path = ? AND state_name = ?")
      for (const [name, count] of perState) state.run(count, testId, path, name)
      const issue = db.prepare(
        "INSERT INTO issues (test_id, component_path, state_name, token, description, difficulty) VALUES (?, ?, ?, ?, ?, '')",
      )
      for (const f of fails) issue.run(testId, path, f.state_name, f.element, f.fail_code)
    })
    console.log(`${path}: grade ${grade}`)
    writeLog(testId)
    break
  }

  case "exclude": {
    const [testId, path] = rest
    if (!testId || !path || !values.reason) fail('exclude <testId> <path> --reason "..."')
    requireComponent(path)
    requireSelected(testId, path)
    db.prepare("UPDATE test_components SET excluded_reason = ?, grade = NULL WHERE test_id = ? AND component_path = ?").run(values.reason, testId, path)
    console.log(`${path}: excluded`)
    writeLog(testId)
    break
  }

  case "finish": {
    const [testId] = rest
    if (!testId) fail("finish <testId>")
    db.prepare("UPDATE tests SET finished_at = ?, status = 'done' WHERE id = ?").run(now(), testId)
    console.log(`test ${testId} finished`)
    console.log(`log: ${writeLog(testId)}`)
    break
  }

  case "feedback": {
    const [testId] = rest
    if (!testId || !values.text) fail('feedback <testId> --text "..." [--component <path>] [--state <name>]')
    if (values.component) requireSelected(testId, values.component)
    db.prepare("INSERT INTO feedback (test_id, component_path, state_name, text, created_at) VALUES (?, ?, ?, ?, ?)").run(
      testId,
      values.component ?? null,
      values.state ?? null,
      values.text,
      now(),
    )
    console.log("feedback recorded")
    writeLog(testId)
    break
  }

  case "log": {
    const [testId] = rest
    if (!testId) fail("log <testId>")
    console.log(writeLog(testId))
    break
  }

  default:
    fail(`Unknown command: ${command ?? "(none)"}. See the header of qa/server/cli.ts.`)
}
