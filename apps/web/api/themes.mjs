// The hosted theme studio's API.
//
// This is the whole point of the online studio: a save here becomes a real
// commit on the repo, which Vercel then deploys, so the site updates without
// anyone opening a terminal. It is the deployed twin of the dev-server plugin
// in apps/web/theme-studio-plugin.ts — both read a workspace, hand it to
// applyThemeChange, and persist the files it returns. Only the storage differs.
//
// Required environment variables (set in the Vercel project):
//   THEME_STUDIO_PASSWORD  unlocks the studio; with none set, every request is refused
//   THEME_STUDIO_GH_TOKEN  a fine-grained GitHub token with Contents: read & write
// Optional:
//   THEME_REPO    "owner/repo"  (defaults to the repo this was deployed from)
//   THEME_BRANCH  branch to commit to (defaults to the production branch)

import { timingSafeEqual } from "node:crypto"
// Imported through the workspace package: Vercel builds this project from
// apps/web, and @workspace/ui is a real dependency of it, so these resolve the
// same way the app's own imports do.
import {
  applyThemeChange,
  listThemes,
  BASELINE,
  COLOR_REGISTRY,
  FONT_REGISTRY,
  TOKENS_CSS,
  TOKENS_DIR,
} from "@workspace/ui/scripts/core/theme-change"
import { formatContrast } from "@workspace/ui/scripts/core/contrast-core"

const API = "https://api.github.com"

const repo = () =>
  process.env.THEME_REPO ||
  (process.env.VERCEL_GIT_REPO_OWNER && process.env.VERCEL_GIT_REPO_SLUG
    ? `${process.env.VERCEL_GIT_REPO_OWNER}/${process.env.VERCEL_GIT_REPO_SLUG}`
    : "")

const branch = () => process.env.THEME_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || "master"

const authorized = (header, password) => {
  if (!header) return false
  const a = Buffer.from(String(header))
  const b = Buffer.from(password)
  return a.length === b.length && timingSafeEqual(a, b)
}

async function gh(path, { token, method = "GET", body } = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      authorization: `Bearer ${token}`,
      accept: "application/vnd.github+json",
      "x-github-api-version": "2022-11-28",
      ...(body ? { "content-type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const detail = data.message ?? `${res.status}`
    throw Object.assign(new Error(`GitHub: ${detail}`), { status: res.status })
  }
  return data
}

/** The same shape readWorkspace() builds from disk, assembled from the repo. */
async function readWorkspace(token) {
  const slug = repo()
  if (!slug) throw new Error("THEME_REPO is not set and could not be inferred.")

  const ref = await gh(`/repos/${slug}/git/ref/heads/${branch()}`, { token })
  const head = ref.object.sha
  const commit = await gh(`/repos/${slug}/git/commits/${head}`, { token })
  const tree = await gh(`/repos/${slug}/git/trees/${commit.tree.sha}?recursive=1`, { token })

  const bySha = new Map(tree.tree.map((e) => [e.path, e.sha]))
  const text = async (path) => {
    const sha = bySha.get(path)
    if (!sha) throw new Error(`${path} is missing from the repo.`)
    const blob = await gh(`/repos/${slug}/git/blobs/${sha}`, { token })
    return Buffer.from(blob.content, blob.encoding === "base64" ? "base64" : "utf8").toString("utf8")
  }

  const themeFiles = tree.tree
    .filter((e) => e.type === "blob")
    .map((e) => e.path)
    .filter((p) => p.startsWith(`${TOKENS_DIR}/`) && p.endsWith(".json"))
    .filter((p) => !p.slice(TOKENS_DIR.length + 1).startsWith("."))

  const [tokensCss, colorRegistry, fontRegistry, baselineRaw, ...themeSources] = await Promise.all([
    text(TOKENS_CSS),
    text(COLOR_REGISTRY),
    text(FONT_REGISTRY),
    bySha.has(BASELINE) ? text(BASELINE) : Promise.resolve("{}"),
    ...themeFiles.map(text),
  ])

  const themes = {}
  for (const source of themeSources) {
    const theme = JSON.parse(source)
    themes[theme.name] = theme
  }

  return {
    workspace: { themes, tokensCss, colorRegistry, fontRegistry, baseline: JSON.parse(baselineRaw) },
    head,
    baseTree: commit.tree.sha,
  }
}

/** One commit containing every changed file — never a commit per file. */
async function commitFiles({ token, files, head, baseTree, message }) {
  const slug = repo()
  const entries = Object.entries(files).map(([path, content]) =>
    content === null
      ? { path, mode: "100644", type: "blob", sha: null }
      : { path, mode: "100644", type: "blob", content }
  )
  if (!entries.length) return null

  const tree = await gh(`/repos/${slug}/git/trees`, {
    token,
    method: "POST",
    body: { base_tree: baseTree, tree: entries },
  })
  const commit = await gh(`/repos/${slug}/git/commits`, {
    token,
    method: "POST",
    body: { message, tree: tree.sha, parents: [head] },
  })
  // force stays false: if the branch moved while the studio was open, this
  // fails rather than clobbering whatever landed in the meantime
  await gh(`/repos/${slug}/git/refs/heads/${branch()}`, {
    token,
    method: "PATCH",
    body: { sha: commit.sha, force: false },
  })
  return commit.sha
}

const readBody = async (req) => {
  if (req.body && typeof req.body === "object") return req.body
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  if (!chunks.length) return {}
  return JSON.parse(Buffer.concat(chunks).toString())
}

export default async function handler(req, res) {
  const send = (code, body) => {
    res.statusCode = code
    res.setHeader("content-type", "application/json")
    res.end(JSON.stringify(body))
  }

  const password = process.env.THEME_STUDIO_PASSWORD ?? ""
  const token = process.env.THEME_STUDIO_GH_TOKEN ?? ""

  if (!password) {
    return send(503, {
      error:
        "THEME_STUDIO_PASSWORD is not set on this deployment. Add it in the Vercel project's environment variables.",
    })
  }
  if (!authorized(req.headers["x-theme-studio-key"], password)) {
    return send(401, { error: "Wrong password." })
  }
  if (!token) {
    return send(503, {
      error:
        "THEME_STUDIO_GH_TOKEN is not set on this deployment, so themes cannot be saved. Add it in the Vercel project's environment variables.",
    })
  }

  try {
    const { workspace, head, baseTree } = await readWorkspace(token)

    if (req.method === "GET") {
      return send(200, { themes: listThemes(workspace.themes), target: "repo", branch: branch() })
    }

    const body = await readBody(req)
    let change
    let message
    if (req.method === "PUT") {
      // `force` carries the designer's answer to the contrast warning through
      // to the core, which then records the shortfalls alongside the theme so
      // the commit is one CI will accept.
      change = { type: "save", theme: body, acceptContrast: Boolean(body.force) }
      message = `Theme: save ${body.label ?? body.name}`
    } else if (req.method === "DELETE") {
      change = { type: "delete", name: body.name }
      message = `Theme: delete ${body.name}`
    } else if (req.method === "POST") {
      change = { type: "reorder", order: body.order }
      message = "Theme: reorder"
    } else {
      return send(405, { error: "Method not allowed." })
    }

    const result = applyThemeChange(workspace, change)

    // A contrast shortfall is shown once and then it is the designer's call, so
    // this asks rather than refuses. It has to ask before committing rather
    // than after: the accepted shortfalls are recorded in the same commit as
    // the theme, and a commit without them goes red in CI and never deploys —
    // the save would report success and change nothing.
    const failures = result.contrast?.failures ?? []
    if (failures.length && !body.force) {
      return send(422, {
        error: `This drops below the contrast rules:\n${formatContrast(result.contrast)}`,
        contrast: formatContrast(result.contrast),
        failures,
      })
    }

    const sha = await commitFiles({ token, files: result.files, head, baseTree, message })

    return send(200, {
      themes: result.themes,
      target: "repo",
      branch: branch(),
      commit: sha,
      deploying: Boolean(sha),
      contrast: formatContrast(result.contrast),
    })
  } catch (error) {
    const status = error?.status === 409 || error?.status === 422 ? 409 : 500
    const message =
      status === 409
        ? "The branch moved while the studio was open. Reload and try again."
        : error instanceof Error
          ? error.message
          : String(error)
    return send(status, { error: message })
  }
}
