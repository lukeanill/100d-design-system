import { timingSafeEqual } from "node:crypto"
import { execFile } from "node:child_process"
import { existsSync, readdirSync, readFileSync, writeFileSync, unlinkSync } from "node:fs"
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
// the two registries the site renders from — a theme that is not in them is
// invisible to the app, however good its CSS is
const REGISTRY = path.join(UI_DIR, "scripts/registry.mjs")
const TOKENS_DIR = path.join(UI_DIR, "tokens")
const run = promisify(execFile)

const authorized = (header: string | undefined, password: string) => {
  if (!header) return false
  const a = Buffer.from(header)
  const b = Buffer.from(password)
  return a.length === b.length && timingSafeEqual(a, b)
}

const SWATCHES = ["background", "foreground", "primary", "secondary", "muted", "accent"]

const readThemes = () =>
  readdirSync(TOKENS_DIR)
    .filter((f) => f.endsWith(".json") && !f.startsWith("."))
    .map((f) => JSON.parse(readFileSync(path.join(TOKENS_DIR, f), "utf8")))
    .map((theme) => ({
      ...theme,
      // the six circles each list row shows, resolved for convenience
      swatches: SWATCHES.map((token) => theme.tokens?.[token]).filter(Boolean),
    }))
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))

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
            const existingPath = path.join(TOKENS_DIR, `${name}.json`)
            const existing = existsSync(existingPath)
              ? JSON.parse(readFileSync(existingPath, "utf8"))
              : {}
            const theme = {
              name,
              label: body.label ?? existing.label ?? body.name ?? name,
              order: body.order ?? existing.order ?? readThemes().length,
              selector: name === "system" ? ":root" : `.${name}`,
              seeds: body.seeds ?? existing.seeds ?? {},
              fonts: body.fonts ?? existing.fonts ?? {},
              edges: body.edges ?? existing.edges ?? "custom",
              overrides: body.overrides ?? existing.overrides ?? {},
              fontSource: body.fontSource ?? existing.fontSource ?? "google",
              ...(body.fontTheme ?? existing.fontTheme
                ? { fontTheme: body.fontTheme ?? existing.fontTheme }
                : {}),
              tokens: body.tokens ?? existing.tokens,
              ...(body.extra ?? existing.extra ? { extra: body.extra ?? existing.extra } : {}),
            }
            writeFileSync(
              path.join(TOKENS_DIR, `${name}.json`),
              JSON.stringify(theme, null, 2) + "\n"
            )

            const registry = await import(/* @vite-ignore */ REGISTRY)
            if (theme.fontSource === "google") {
              // a Google-font theme brings its own pairing along
              registry.upsertFontTheme({
                id: name,
                label: theme.label,
                primaryFont: theme.fonts?.primary ?? "",
                secondaryFont: theme.fonts?.emphasis ?? "",
              })
            }
            registry.upsertColorTheme({
              id: name,
              label: theme.label,
              fontTheme: theme.fontTheme ?? (theme.fontSource === "google" ? name : undefined),
            })
          } else if (req.method === "POST") {
            const order: string[] = Array.isArray(body.order) ? body.order : []
            if (!order.length) return send(400, { error: "Send an ordered list of theme names." })
            order.forEach((themeName, index) => {
              const file = path.join(TOKENS_DIR, `${slug(themeName)}.json`)
              if (!existsSync(file)) return
              const theme = JSON.parse(readFileSync(file, "utf8"))
              if (theme.order === index) return
              writeFileSync(file, JSON.stringify({ ...theme, order: index }, null, 2) + "\n")
            })
            // order is metadata only — no CSS regeneration needed
            return send(200, { themes: readThemes() })
          } else if (req.method === "DELETE") {
            const name = slug(body.name ?? "")
            if (!name || name === "system") return send(400, { error: "Cannot delete that theme." })
            const removing = JSON.parse(readFileSync(path.join(TOKENS_DIR, `${name}.json`), "utf8"))
            unlinkSync(path.join(TOKENS_DIR, `${name}.json`))
            const reg = await import(/* @vite-ignore */ REGISTRY)
            reg.removeColorTheme(name)
            if (removing.fontSource === "google") reg.removeFontTheme(name)
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
