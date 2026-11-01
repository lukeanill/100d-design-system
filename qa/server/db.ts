import { mkdirSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { DatabaseSync } from "node:sqlite"

const here = dirname(fileURLToPath(import.meta.url))
export const DB_PATH = process.env.QA_DB ?? resolve(here, "../data/qa.db")

/**
 * Everything the later phases need is here from the start, so adding overrides, the
 * dashboard or the fix flow never migrates old results. `overrides` is `{}` until phase 2;
 * `fixes` stays empty until the fix flow.
 */
const SCHEMA = `
CREATE TABLE IF NOT EXISTS components (
  path       TEXT PRIMARY KEY,           -- the Storybook title, lowercased: components/actions/button
  title      TEXT NOT NULL,              -- the Storybook title as written
  category   TEXT NOT NULL,
  name       TEXT NOT NULL,
  position   INTEGER NOT NULL,           -- Storybook order
  story_ids  TEXT NOT NULL,              -- JSON array
  present    INTEGER NOT NULL DEFAULT 1, -- 0 once it leaves Storybook; history is kept
  first_seen TEXT NOT NULL,
  last_seen  TEXT NOT NULL
);

-- The states Claude judged worth testing, and why.
CREATE TABLE IF NOT EXISTS states (
  id             INTEGER PRIMARY KEY,
  component_path TEXT NOT NULL REFERENCES components(path),
  name           TEXT NOT NULL,
  is_default     INTEGER NOT NULL DEFAULT 0, -- shown by the Storybook story on load
  reason         TEXT NOT NULL DEFAULT '',
  UNIQUE (component_path, name)
);

CREATE TABLE IF NOT EXISTS tests (
  id          INTEGER PRIMARY KEY,
  started_at  TEXT NOT NULL,
  finished_at TEXT,
  theme       TEXT NOT NULL,
  overrides   TEXT NOT NULL DEFAULT '{}',
  states_mode TEXT NOT NULL CHECK (states_mode IN ('defaults', 'all')),
  status      TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'done', 'abandoned'))
);

CREATE TABLE IF NOT EXISTS test_components (
  test_id         INTEGER NOT NULL REFERENCES tests(id),
  component_path  TEXT NOT NULL REFERENCES components(path),
  grade           TEXT,                  -- Claude's finding; null while excluded
  issue_count     INTEGER NOT NULL DEFAULT 0,
  summary         TEXT NOT NULL DEFAULT '',
  excluded_reason TEXT,                  -- set when the component could not be rendered
  PRIMARY KEY (test_id, component_path)
);

CREATE TABLE IF NOT EXISTS test_states (
  test_id        INTEGER NOT NULL REFERENCES tests(id),
  component_path TEXT NOT NULL,
  state_name     TEXT NOT NULL,
  issue_count    INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (test_id, component_path, state_name)
);

-- The test log: every element of every state, what was expected, and the outcome.
-- A FAIL is an issue; fail_code is the short reason ("not using theme token").
CREATE TABLE IF NOT EXISTS checks (
  id             INTEGER PRIMARY KEY,
  test_id        INTEGER NOT NULL REFERENCES tests(id),
  component_path TEXT NOT NULL,
  state_name     TEXT NOT NULL,
  element        TEXT NOT NULL,
  expected       TEXT NOT NULL,
  outcome        TEXT CHECK (outcome IN ('PASS', 'FAIL')), -- null until tested
  fail_code      TEXT NOT NULL DEFAULT '',
  UNIQUE (test_id, component_path, state_name, element)
);

-- What the user said while reviewing a test (annotations and notes), kept in the log.
CREATE TABLE IF NOT EXISTS feedback (
  id             INTEGER PRIMARY KEY,
  test_id        INTEGER NOT NULL REFERENCES tests(id),
  component_path TEXT,
  state_name     TEXT,
  text           TEXT NOT NULL,
  created_at     TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS issues (
  id             INTEGER PRIMARY KEY,
  test_id        INTEGER NOT NULL REFERENCES tests(id),
  component_path TEXT NOT NULL,
  state_name     TEXT NOT NULL,
  token          TEXT NOT NULL DEFAULT '',
  description    TEXT NOT NULL,
  difficulty     TEXT NOT NULL DEFAULT ''
);

-- The user's judgement of a component in a test.
CREATE TABLE IF NOT EXISTS ratings (
  test_id        INTEGER NOT NULL REFERENCES tests(id),
  component_path TEXT NOT NULL,
  rating         TEXT NOT NULL CHECK (rating IN ('perfect', 'minor', 'major', 'critical')),
  rated_at       TEXT NOT NULL,
  PRIMARY KEY (test_id, component_path)
);

CREATE TABLE IF NOT EXISTS fixes (
  id             INTEGER PRIMARY KEY,
  test_id        INTEGER REFERENCES tests(id),
  component_path TEXT NOT NULL REFERENCES components(path),
  state_name     TEXT,
  description    TEXT NOT NULL,
  files          TEXT NOT NULL DEFAULT '[]',
  created_at     TEXT NOT NULL
);
`

let db: DatabaseSync | undefined

export function getDb(): DatabaseSync {
  if (db) return db
  mkdirSync(dirname(DB_PATH), { recursive: true })
  db = new DatabaseSync(DB_PATH)
  db.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;")
  db.exec(SCHEMA)
  // columns added after the first release
  const columns = (db.prepare("PRAGMA table_info(tests)").all() as { name: string }[]).map((c) => c.name)
  if (!columns.includes("estimate_minutes")) db.exec("ALTER TABLE tests ADD COLUMN estimate_minutes INTEGER")
  return db
}

export const now = () => new Date().toISOString()

/** Run `fn` in one transaction. */
export function transaction<T>(fn: () => T): T {
  const d = getDb()
  d.exec("BEGIN")
  try {
    const result = fn()
    d.exec("COMMIT")
    return result
  } catch (error) {
    d.exec("ROLLBACK")
    throw error
  }
}
