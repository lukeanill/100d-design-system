import { timingSafeEqual } from "node:crypto"
import { execFile } from "node:child_process"
import { readdirSync, readFileSync, writeFileSync, unlinkSync } from "node:fs"
import { promisify } from "node:util"
import path from "path"
import { loadEnv, type Plugin } from "vite"

/**
 * Dev-only API behind the /themes studio. Never registered in a build
 * (`apply: "serve"`), so this cannot ship to production.
 *
 * Auth: set THEME_STUDIO_PASSWORD in apps/web/.env.local. With no password
 * set the endpoint refuses every request — it fails closed rather than
 * leaving an unauthenticated file writer on your network.
 */
const UI_DIR = path.resolve(__dirname, "../../packages/ui")
const TOKENS_DIR = path.join(UI_DIR, "tokens")
const run = promisify(execFile)

const authorized = (header: string | undefined, password: string) => {
  if (!header) return false
  const a = Buffer.from(header)
  const b = Buffer.from(password)
  return a.length === b.length && timingSafeEqual(a, b)
}

const readThemes = () =>
  readdirSync(TOKENS_DIR)
    .filter((f) => f.endsWith(".json") && !f.startsWith("."))
    .map((f) => JSON.parse(readFileSync(path.join(TOKENS_DIR, f), "utf8")))

const slug = (name: string) =>
  name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

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
          if (req.method === "GET") return send(200, { themes: readThemes() })

          const chunks: Buffer[] = []
          for await (const c of req) chunks.push(c as Buffer)
          const body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString()) : {}

          if (req.method === "PUT") {
            const name = slug(body.name ?? "")
            if (!name) return send(400, { error: "A theme needs a name." })
            const theme = {
              name,
              selector: name === "system" ? ":root" : `.${name}`,
              ...(body.fonts ? { fonts: body.fonts } : {}),
              tokens: body.tokens,
              ...(body.extra ? { extra: body.extra } : {}),
            }
            writeFileSync(
              path.join(TOKENS_DIR, `${name}.json`),
              JSON.stringify(theme, null, 2) + "\n"
            )
          } else if (req.method === "DELETE") {
            const name = slug(body.name ?? "")
            if (!name || name === "system") return send(400, { error: "Cannot delete that theme." })
            unlinkSync(path.join(TOKENS_DIR, `${name}.json`))
          } else {
            return send(405, { error: "Method not allowed." })
          }

          // regenerate tokens.css so the change is live and diffable
          await run("node", ["scripts/build-tokens.mjs"], { cwd: UI_DIR })
          const { stdout } = await run("node", ["scripts/check-contrast.mjs", "--warn"], {
            cwd: UI_DIR,
          })
          return send(200, { themes: readThemes(), contrast: stdout })
        } catch (error) {
          return send(500, { error: error instanceof Error ? error.message : String(error) })
        }
      })
    },
  }
}
