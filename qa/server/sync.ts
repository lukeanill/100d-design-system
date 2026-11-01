import { getDb, now, transaction } from "./db.ts"

export const STORYBOOK_URL = process.env.QA_STORYBOOK_URL ?? "http://localhost:6006"

interface IndexEntry {
  id: string
  title: string
  type: string
  tags?: string[]
}

export interface ParsedComponent {
  path: string
  title: string
  category: string
  name: string
  storyIds: string[]
}

/** Top-level Storybook folders left out of testing for now. Remove "Animation" to bring it in. */
const LEFT_OUT = ["Tokens", "Animation"]

/**
 * Groups Storybook's story index into components, in Storybook order. A component is a
 * story title, grouped under its folder path exactly as the sidebar nests it. Only stories
 * the sidebar shows (tagged `dev`) count; the Tokens pages describe the system rather than
 * a component, and Animation is held back (see LEFT_OUT).
 */
export function parseIndex(entries: Record<string, IndexEntry>): ParsedComponent[] {
  const byTitle = new Map<string, ParsedComponent>()
  for (const entry of Object.values(entries)) {
    if (entry.type !== "story" || !entry.tags?.includes("dev") || LEFT_OUT.includes(entry.title.split("/")[0])) continue
    const parts = entry.title.split("/")
    const found = byTitle.get(entry.title)
    if (found) {
      found.storyIds.push(entry.id)
      continue
    }
    byTitle.set(entry.title, {
      path: entry.title.toLowerCase(),
      title: entry.title,
      category: parts.slice(0, -1).join(" / ") || parts[0],
      name: parts[parts.length - 1],
      storyIds: [entry.id],
    })
  }
  return [...byTitle.values()]
}

export type SyncResult =
  | { ok: true; total: number; added: string[]; removed: string[] }
  | { ok: false; error: string }

/** Brings the component table in line with what Storybook shows right now. */
export async function syncStorybook(url = STORYBOOK_URL): Promise<SyncResult> {
  let components: ParsedComponent[]
  try {
    const response = await fetch(`${url}/index.json`, { signal: AbortSignal.timeout(4000) })
    if (!response.ok) return { ok: false, error: `Storybook answered ${response.status}` }
    const index = (await response.json()) as { entries: Record<string, IndexEntry> }
    components = parseIndex(index.entries)
  } catch {
    return { ok: false, error: `Storybook is not reachable at ${url}` }
  }

  const db = getDb()
  const stamp = now()
  const known = new Map(
    (db.prepare("SELECT path, present FROM components").all() as { path: string; present: number }[]).map((r) => [r.path, r.present]),
  )
  const live = new Set(components.map((c) => c.path))
  const added = components.filter((c) => !known.has(c.path) || known.get(c.path) === 0).map((c) => c.path)
  const removed = [...known].filter(([path, present]) => present === 1 && !live.has(path)).map(([path]) => path)

  transaction(() => {
    const upsert = db.prepare(`
      INSERT INTO components (path, title, category, name, position, story_ids, present, first_seen, last_seen)
      VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)
      ON CONFLICT (path) DO UPDATE SET
        title = excluded.title, category = excluded.category, name = excluded.name,
        position = excluded.position, story_ids = excluded.story_ids, present = 1, last_seen = excluded.last_seen`)
    components.forEach((c, position) =>
      upsert.run(c.path, c.title, c.category, c.name, position, JSON.stringify(c.storyIds), stamp, stamp),
    )
    const retire = db.prepare("UPDATE components SET present = 0 WHERE path = ?")
    removed.forEach((path) => retire.run(path))
  })

  return { ok: true, total: components.length, added, removed }
}
