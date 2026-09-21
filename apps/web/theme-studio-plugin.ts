import { timingSafeEqual } from "node:crypto"
import path from "path"
import { pathToFileURL } from "node:url"
import { loadEnv, type Plugin } from "vite"

/**
 * Local API behind the /themes studio when you run `pnpm dev`.
 *
 * It is the localhost twin of api/themes.ts: both read a workspace, hand it to
 * applyThemeChange, and persist whatever files come back. The difference is
 * only where those files go — here, straight to your working copy; there, to a
 * commit on the repo. Saving a theme locally still needs a commit and push to
 * reach the site; saving it on the deployed studio does not.
 *
 * Registered with `apply: "serve"`, so this never ships in a build.
 *
 * Auth: set THEME_STUDIO_PASSWORD in apps/web/.env.local. With no password
 * set the endpoint refuses every request — it fails closed rather than
 * leaving an unauthenticated file writer on your network.
 */
const ROOT = path.resolve(__dirname, "../..")
const CORE = path.join(ROOT, "packages/ui/scripts/core")

const load = (file: string) => import(/* @vite-ignore */ pathToFileURL(path.join(CORE, file)).href)

const authorized = (header: string | undefined, password: string) => {
  if (!header) return false
  const a = Buffer.from(header)
  const b = Buffer.from(password)
  return a.length === b.length && timingSafeEqual(a, b)
}

export function themeStudio(): Plugin {
  return {
    name: "theme-studio",
    apply: "serve",
    configureServer(server) {
      // .env.local reaches import.meta.env, not process.env, so load it here
      const env = loadEnv(server.config.mode, server.config.root, "")
      const password = env.THEME_STUDIO_PASSWORD ?? process.env.THEME_STUDIO_PASSWORD ?? ""

      server.middlewares.use("/__themes", async (req, res) => {
        const send = (code: number, body: unknown) => {
          res.statusCode = code
          res.setHeader("content-type", "application/json")
          res.end(JSON.stringify(body))
        }

        if (!password) {
          return send(503, {
            error:
              "THEME_STUDIO_PASSWORD is not set. Add it to apps/web/.env.local and restart the dev server.",
          })
        }
        if (!authorized(req.headers["x-theme-studio-key"] as string, password)) {
          return send(401, { error: "Wrong password." })
        }

        try {
          const change = await load("theme-change.mjs")
          const fs = await load("workspace-fs.mjs")
          const contrastCore = await load("contrast-core.mjs")

          const workspace = fs.readWorkspace(ROOT)
          if (req.method === "GET") {
            return send(200, { themes: change.listThemes(workspace.themes), target: "local" })
          }

          const chunks: Buffer[] = []
          for await (const c of req) chunks.push(c as Buffer)
          const body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString()) : {}

          let request
          if (req.method === "PUT") request = { type: "save", theme: body }
          else if (req.method === "DELETE") request = { type: "delete", name: body.name }
          else if (req.method === "POST") request = { type: "reorder", order: body.order }
          else return send(405, { error: "Method not allowed." })

          const result = change.applyThemeChange(workspace, request)
          fs.writeFiles(ROOT, result.files)

          // locally, contrast problems are reported but never block the write
          return send(200, {
            themes: result.themes,
            target: "local",
            contrast: contrastCore.formatContrast(result.contrast),
            blocking: result.contrast?.failures?.length ?? 0,
          })
        } catch (error) {
          return send(500, { error: error instanceof Error ? error.message : String(error) })
        }
      })
    },
  }
}
