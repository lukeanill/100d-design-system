import { execFile } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { promisify } from "node:util"
import type { Plugin } from "vite"

const run = promisify(execFile)

// import.meta.url, not __dirname: Storybook loads this from an ES module
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..")
/** How often a running dev server looks for themes saved on the live studio. */
const INTERVAL_MS = 20_000
const REMOTE = "origin"
const BRANCH = "master"

/**
 * Brings themes saved on the live studio into a running dev server.
 *
 * Theming is edited in one place: the live studio at /themes, which commits to
 * the repo. This is the other half. While `pnpm dev` or `pnpm stories` is up it
 * fetches the remote every few seconds and, when the live studio has committed,
 * fast-forwards the working copy, so Vite reloads with the new theme and nobody
 * has to run `git pull`.
 *
 * It is deliberately timid. It only ever fast-forwards, only on `master`, and
 * lets git refuse if the incoming commits touch a file you have changed. In any
 * of those cases it says so once and leaves everything as it was. It never
 * merges, rebases, stashes or discards anything of yours.
 *
 * Set THEME_SYNC=off to switch it off.
 */
export function themeSync(): Plugin {
  return {
    name: "theme-sync",
    apply: "serve",
    configureServer(server) {
      if (process.env.THEME_SYNC === "off") return

      const log = server.config.logger
      let busy = false
      let told = ""

      const git = async (...args: string[]) => (await run("git", args, { cwd: ROOT })).stdout.trim()

      /** Say a thing once, not every twenty seconds. */
      const say = (message: string, level: "info" | "warn" = "info") => {
        if (message === told) return
        told = message
        log[level](`[theme-sync] ${message}`, { timestamp: true })
      }

      const tick = async () => {
        if (busy) return
        busy = true
        try {
          if ((await git("rev-parse", "--abbrev-ref", "HEAD")) !== BRANCH) {
            return say(`not on ${BRANCH}, so live themes are not being pulled in.`)
          }
          await git("fetch", "--quiet", REMOTE, BRANCH)
          const behind = Number(await git("rev-list", "--count", `HEAD..${REMOTE}/${BRANCH}`))
          if (!behind) {
            told = ""
            return
          }
          const ahead = Number(await git("rev-list", "--count", `${REMOTE}/${BRANCH}..HEAD`))
          if (ahead) {
            return say(
              `${ahead} local commit(s) not pushed, so the ${behind} new one(s) from the live site cannot be fast-forwarded. Push, or run \`git pull --rebase\`.`,
              "warn"
            )
          }
          const files = (await git("diff", "--name-only", `HEAD..${REMOTE}/${BRANCH}`)).split("\\n").filter(Boolean)
          await git("merge", "--ff-only", "--quiet", `${REMOTE}/${BRANCH}`)
          told = ""
          const themes = files.filter((f) => f.startsWith("packages/ui/tokens/") && f.endsWith(".json"))
          log.info(
            `[theme-sync] pulled ${behind} commit(s) from the live site` +
              (themes.length ? ` (${themes.map((f) => path.basename(f, ".json")).join(", ")})` : ""),
            { timestamp: true }
          )
        } catch (error) {
          // most often: the incoming commits touch a file with uncommitted changes
          const detail = error instanceof Error ? error.message.split("\\n").find((l) => l.trim()) : String(error)
          say(`could not pull live themes: ${detail}`, "warn")
        } finally {
          busy = false
        }
      }

      void tick()
      const timer = setInterval(tick, INTERVAL_MS)
      timer.unref()
      server.httpServer?.on("close", () => clearInterval(timer))
    },
  }
}
