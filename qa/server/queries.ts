import { RATINGS, type Rating } from "../shared/grade.ts"
import { getDb, now } from "./db.ts"

/** How a component's states stand, as the Run page counts them. */
export interface RowStats {
  total: number
  perfect: number
  minor: number
  major: number
  critical: number
  /** States never tested: the 👻 count. */
  untested: number
}

export interface ComponentRow {
  path: string
  name: string
  stats: RowStats | null
  excludedReason: string | null
}

export interface CategoryRows {
  category: string
  components: ComponentRow[]
}

type Rec = Record<string, unknown>
const all = (sql: string, ...args: (string | number)[]) => getDb().prepare(sql).all(...args) as Rec[]
const one = (sql: string, ...args: (string | number)[]) => getDb().prepare(sql).get(...args) as Rec | undefined

/**
 * The Run page's component list, grouped by category in Storybook order.
 *
 * A state's severity is the user's rating of its component in the latest test that covered
 * the state. Only the user rates: Claude's finding (even "no issues") never counts as Perfect.
 * States that never had a test are untested; tested states the user has not rated yet are in
 * the total only. A component with no states recorded yet has no stats.
 */
export function listComponents(): CategoryRows[] {
  const components = all("SELECT path, category, name FROM components WHERE present = 1 ORDER BY position")

  const statesOf = new Map<string, string[]>()
  for (const s of all("SELECT component_path AS p, name FROM states ORDER BY id")) {
    const list = statesOf.get(s.p as string) ?? []
    list.push(s.name as string)
    statesOf.set(s.p as string, list)
  }

  const lastState = new Map<string, { issues: number; test: number }>()
  for (const r of all(`
    SELECT ts.component_path AS p, ts.state_name AS s, ts.issue_count AS issues, ts.test_id AS test
    FROM test_states ts
    JOIN (SELECT component_path, state_name, MAX(test_id) AS t FROM test_states GROUP BY 1, 2) m
      ON m.component_path = ts.component_path AND m.state_name = ts.state_name AND m.t = ts.test_id`)) {
    lastState.set(`${r.p}\u0000${r.s}`, { issues: r.issues as number, test: r.test as number })
  }

  const rated = new Map<string, Rating>()
  for (const r of all("SELECT test_id AS t, component_path AS p, rating FROM ratings")) {
    rated.set(`${r.t}\u0000${r.p}`, r.rating as Rating)
  }

  const excluded = new Map<string, string>()
  for (const r of all(`
    SELECT tc.component_path AS p, tc.excluded_reason AS reason
    FROM test_components tc
    JOIN (SELECT component_path, MAX(test_id) AS t FROM test_components GROUP BY 1) m
      ON m.component_path = tc.component_path AND m.t = tc.test_id
    WHERE tc.excluded_reason IS NOT NULL`)) {
    excluded.set(r.p as string, r.reason as string)
  }

  const groups = new Map<string, ComponentRow[]>()
  for (const c of components) {
    const path = c.path as string
    const states = statesOf.get(path) ?? []
    let stats: RowStats | null = null
    if (states.length) {
      stats = { total: states.length, perfect: 0, minor: 0, major: 0, critical: 0, untested: 0 }
      for (const state of states) {
        const last = lastState.get(`${path}\u0000${state}`)
        if (!last) stats.untested++
        else {
          const rating = rated.get(`${last.test}\u0000${path}`)
          if (rating) stats[rating]++
        }
      }
    }
    const rows = groups.get(c.category as string) ?? []
    rows.push({ path, name: c.name as string, stats, excludedReason: excluded.get(path) ?? null })
    groups.set(c.category as string, rows)
  }
  return [...groups].map(([category, rows]) => ({ category, components: rows }))
}

/** Seconds a state takes to test: the average of past tests, or a starting guess. */
const DEFAULT_SECONDS_PER_STATE = 45

export function estimateMinutes(paths: string[], mode: "defaults" | "all"): number {
  const history = one(`
    SELECT SUM((julianday(t.finished_at) - julianday(t.started_at)) * 86400) AS seconds,
           (SELECT COUNT(*) FROM test_states ts WHERE ts.test_id IN (SELECT id FROM tests WHERE finished_at IS NOT NULL)) AS states
    FROM tests t WHERE t.finished_at IS NOT NULL`)
  const perState =
    history && (history.states as number) > 0 && (history.seconds as number) > 0
      ? (history.seconds as number) / (history.states as number)
      : DEFAULT_SECONDS_PER_STATE

  let states = 0
  for (const path of paths) {
    const known = one("SELECT COUNT(*) AS n, SUM(is_default) AS d FROM states WHERE component_path = ?", path)
    const total = (known?.n as number) ?? 0
    const defaults = Math.max(1, (known?.d as number) ?? 0)
    // Components with no states recorded yet: one default, and a handful once Claude has chosen.
    states += mode === "defaults" ? defaults : total || 4
  }
  return Math.max(1, Math.round((states * perState) / 60))
}

export interface TestComponent {
  path: string
  name: string
  grade: string | null
  issueCount: number
  summary: string
  excludedReason: string | null
  rating: Rating | null
  states: { name: string; issueCount: number }[]
  issues: { state: string; token: string; description: string; difficulty: string }[]
}

export interface TestDetail {
  id: number
  startedAt: string
  finishedAt: string | null
  theme: string
  overrides: Record<string, string>
  statesMode: "defaults" | "all"
  status: string
  minutesTaken: number | null
  componentCount: number
  stateCount: number
  components: TestComponent[]
}

export function latestTestId(): number | null {
  return (one("SELECT MAX(id) AS id FROM tests")?.id as number | null) ?? null
}

export function getTest(id: number): TestDetail | null {
  const t = one("SELECT * FROM tests WHERE id = ?", id)
  if (!t) return null

  const rows = all(
    `SELECT tc.*, c.name, c.position, r.rating
     FROM test_components tc
     JOIN components c ON c.path = tc.component_path
     LEFT JOIN ratings r ON r.test_id = tc.test_id AND r.component_path = tc.component_path
     WHERE tc.test_id = ? ORDER BY c.position`,
    id,
  )
  const stateRows = all("SELECT component_path AS p, state_name AS name, issue_count AS n FROM test_states WHERE test_id = ?", id)
  const issueRows = all("SELECT component_path AS p, state_name AS state, token, description, difficulty FROM issues WHERE test_id = ? ORDER BY id", id)

  const components: TestComponent[] = rows.map((r) => ({
    path: r.component_path as string,
    name: r.name as string,
    grade: r.grade as string | null,
    issueCount: r.issue_count as number,
    summary: r.summary as string,
    excludedReason: r.excluded_reason as string | null,
    rating: (r.rating as Rating | null) ?? null,
    states: stateRows.filter((s) => s.p === r.component_path).map((s) => ({ name: s.name as string, issueCount: s.n as number })),
    issues: issueRows
      .filter((i) => i.p === r.component_path)
      .map((i) => ({ state: i.state as string, token: i.token as string, description: i.description as string, difficulty: i.difficulty as string })),
  }))

  const started = Date.parse(t.started_at as string)
  const finished = t.finished_at ? Date.parse(t.finished_at as string) : null
  return {
    id,
    startedAt: t.started_at as string,
    finishedAt: (t.finished_at as string | null) ?? null,
    theme: t.theme as string,
    overrides: JSON.parse(t.overrides as string) as Record<string, string>,
    statesMode: t.states_mode as "defaults" | "all",
    status: t.status as string,
    minutesTaken: finished === null ? null : Math.max(1, Math.round((finished - started) / 60000)),
    componentCount: components.filter((c) => !c.excludedReason).length,
    stateCount: stateRows.length,
    components,
  }
}

export function setRating(testId: number, path: string, rating: string) {
  if (!(RATINGS as readonly string[]).includes(rating)) throw new Error(`Unknown rating: ${rating}`)
  const exists = one("SELECT 1 AS ok FROM test_components WHERE test_id = ? AND component_path = ?", testId, path)
  if (!exists) throw new Error(`Test ${testId} has no ${path}`)
  getDb()
    .prepare(
      `INSERT INTO ratings (test_id, component_path, rating, rated_at) VALUES (?, ?, ?, ?)
       ON CONFLICT (test_id, component_path) DO UPDATE SET rating = excluded.rating, rated_at = excluded.rated_at`,
    )
    .run(testId, path, rating, now())
}
