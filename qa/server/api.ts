import type { IncomingMessage, ServerResponse } from "node:http"
import type { Plugin } from "vite"

import { estimateMinutes, getTest, latestTestId, listComponents, setRating } from "./queries.ts"
import { STORYBOOK_URL, syncStorybook } from "./sync.ts"

const SYNC_EVERY_MS = 5000

let lastSync = 0
let lastError: string | null = null

/** Re-reads Storybook at most every few seconds, so the list stays in step without hammering it. */
async function keepInSync() {
  if (Date.now() - lastSync < SYNC_EVERY_MS) return
  lastSync = Date.now()
  const result = await syncStorybook()
  lastError = result.ok ? null : result.error
}

function send(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status
  res.setHeader("content-type", "application/json")
  res.end(JSON.stringify(body))
}

async function readJson(req: IncomingMessage) {
  const chunks: Buffer[] = []
  for await (const chunk of req) chunks.push(chunk as Buffer)
  return JSON.parse(Buffer.concat(chunks).toString() || "{}") as Record<string, unknown>
}

async function handle(req: IncomingMessage, res: ServerResponse, url: URL) {
  const path = url.pathname

  if (req.method === "GET" && path === "/api/components") {
    await keepInSync()
    return send(res, 200, { storybookUrl: STORYBOOK_URL, offline: lastError, categories: listComponents() })
  }

  if (req.method === "GET" && path === "/api/estimate") {
    const paths = (url.searchParams.get("paths") ?? "").split(",").filter(Boolean)
    const mode = url.searchParams.get("mode") === "all" ? "all" : "defaults"
    return send(res, 200, { minutes: estimateMinutes(paths, mode) })
  }

  if (req.method === "GET" && path === "/api/tests/latest") {
    const id = latestTestId()
    return send(res, 200, { test: id === null ? null : getTest(id), storybookUrl: STORYBOOK_URL })
  }

  const test = path.match(/^\/api\/tests\/(\d+)$/)
  if (req.method === "GET" && test) {
    const found = getTest(Number(test[1]))
    return found ? send(res, 200, { test: found, storybookUrl: STORYBOOK_URL }) : send(res, 404, { error: "No such test" })
  }

  const rating = path.match(/^\/api\/tests\/(\d+)\/rating$/)
  if (req.method === "POST" && rating) {
    const body = await readJson(req)
    setRating(Number(rating[1]), String(body.component), String(body.rating))
    return send(res, 200, { ok: true })
  }

  return send(res, 404, { error: "Not found" })
}

/** The QA app's API, served by the Vite dev server so one command runs everything. */
export function qaApi(): Plugin {
  return {
    name: "qa-api",
    configureServer(server) {
      // the app, and so its API, sits under the base path: /qa/api/...
      const base = server.config.base.replace(/\/$/, "")
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith(`${base}/api/`)) return next()
        handle(req, res, new URL(req.url.slice(base.length), "http://localhost")).catch((error: unknown) =>
          send(res, 500, { error: error instanceof Error ? error.message : String(error) }),
        )
      })
    },
  }
}
