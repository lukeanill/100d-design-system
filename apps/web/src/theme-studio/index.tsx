import { useEffect, useState } from "react"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import {
  ContrastBlocked,
  clearKey,
  deleteTheme,
  listThemes,
  reorderThemes,
  saveTheme,
  setKey,
  type Theme,
  type ThemesResponse,
} from "./api"
import { ThemeEditor } from "./ThemeEditor"
import { ThemeList } from "./ThemeList"

/* Theme manager. Seeds in, full palette out: four colours, three fonts and an
 * edge preset, with every other token derived so a theme cannot land below the
 * contrast the CI gate enforces.
 *
 * Runs in two places. On localhost it writes to your working copy, and the
 * change reaches the site when you commit and push. On the deployed site it
 * commits for you, and Vercel redeploys — which is the whole reason it is
 * hosted. `target` in the API response says which one you are looking at. */

function Lock({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState("")
  const [error, setError] = useState<string | null>(null)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setKey(value)
    try {
      await listThemes()
      onUnlock()
    } catch (e) {
      clearKey()
      setError(e instanceof Error ? e.message : "Could not unlock.")
    }
  }

  return (
    // matches the studio: light regardless of the app's current theme
    <div className="flex min-h-screen items-center justify-center bg-white p-6 text-neutral-900">
      <form onSubmit={submit} className="flex w-80 flex-col gap-3">
        <Input
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Password"
          aria-label="Theme studio password"
          // submit explicitly: implicit form submission did not fire reliably here
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              void submit(e)
            }
          }}
          autoFocus
        />
        {error && <p className="text-sm text-destructive whitespace-pre-line">{error}</p>}
        <Button type="submit">Unlock</Button>
      </form>
    </div>
  )
}

export function ThemeStudio() {
  const [unlocked, setUnlocked] = useState(false)
  const [themes, setThemes] = useState<Theme[]>([])
  const [target, setTarget] = useState<ThemesResponse["target"]>(undefined)
  const [editing, setEditing] = useState<Theme | null | "new">(null)
  const [status, setStatus] = useState<string | null>(null)
  const [blocked, setBlocked] = useState<{ message: string; retry: () => void } | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!unlocked) return
    listThemes()
      .then((d) => {
        setThemes(d.themes)
        setTarget(d.target)
      })
      .catch((e) => setStatus(e.message))
  }, [unlocked])

  /* A save on the deployed studio is not finished when the request returns —
   * it is a commit, and the site catches up when the build does. Say so, rather
   * than letting "Saved" imply the site already changed. */
  const outcome = (data: ThemesResponse, message: string) =>
    data.deploying
      ? `${message} Committed to ${data.branch ?? "the repo"} — the site rebuilds in a minute or two.`
      : message

  const run = async (action: () => Promise<ThemesResponse>, message: string) => {
    setBusy(true)
    setStatus(null)
    setBlocked(null)
    try {
      const data = await action()
      setThemes(data.themes)
      if (data.target) setTarget(data.target)
      setStatus(outcome(data, message))
      return true
    } catch (e) {
      if (e instanceof ContrastBlocked) {
        setBlocked({ message: e.message, retry: () => void run(() => action(), message) })
      } else {
        setStatus(e instanceof Error ? e.message : "Something went wrong.")
      }
      return false
    } finally {
      setBusy(false)
    }
  }

  if (!unlocked) return <Lock onUnlock={() => setUnlocked(true)} />

  /* The studio is always light, whatever theme the app is set to. Themes are
   * applied as a class on <html>, so rather than fight the cascade we paint the
   * light theme's own tokens onto this subtree. */
  const lightTokens = themes.find((t) => t.name === "light")?.tokens ?? {}
  const lightStyle = Object.fromEntries(
    Object.entries(lightTokens).map(([token, value]) => [`--${token}`, value])
  ) as React.CSSProperties

  return (
    <div style={lightStyle} className="min-h-screen bg-background text-foreground">
      {editing ? (
        <ThemeEditor
          theme={editing === "new" ? null : editing}
          busy={busy}
          onCancel={() => setEditing(null)}
          onSave={async (theme) => {
            const save = (force: boolean) => () => saveTheme(theme, force)
            const label = theme.label ?? theme.name
            setBusy(true)
            setStatus(null)
            setBlocked(null)
            try {
              const data = await saveTheme(theme)
              setThemes(data.themes)
              if (data.target) setTarget(data.target)
              setStatus(outcome(data, `Saved ${label}.`))
              setEditing(null)
            } catch (e) {
              if (e instanceof ContrastBlocked) {
                setBlocked({
                  message: e.message,
                  retry: () => {
                    void run(save(true), `Saved ${label} despite the contrast warning.`).then(
                      (ok) => ok && setEditing(null)
                    )
                  },
                })
              } else {
                setStatus(e instanceof Error ? e.message : "Something went wrong.")
              }
            } finally {
              setBusy(false)
            }
          }}
        />
      ) : (
        <ThemeList
          themes={themes}
          onNew={() => setEditing("new")}
          onEdit={(theme) => setEditing(theme)}
          onDelete={(theme) => run(() => deleteTheme(theme.name), `Deleted ${theme.label}.`)}
          onReorder={(names) => {
            // optimistic: the rows should follow the pointer, not the round trip
            setThemes((prev) => names.flatMap((n) => prev.find((t) => t.name === n) ?? []))
            void run(() => reorderThemes(names), "Order saved.")
          }}
        />
      )}

      {blocked && (
        <div
          role="alert"
          className="mx-auto mb-10 max-w-2xl rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm"
        >
          <p className="mb-3 font-medium">Not saved — this would fail the contrast check.</p>
          <pre className="mb-3 overflow-x-auto whitespace-pre-wrap font-mono text-xs text-muted-foreground">
            {blocked.message}
          </pre>
          <p className="mb-3 text-muted-foreground">
            {target === "repo"
              ? "Saving it anyway would turn the build red, and the site would keep showing the old themes until it is fixed."
              : "Saving it anyway is fine locally, but CI will reject it when you push."}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setBlocked(null)}>
              Go back and fix it
            </Button>
            <Button variant="ghost" size="sm" disabled={busy} onClick={blocked.retry}>
              Save anyway
            </Button>
          </div>
        </div>
      )}

      {status && (
        <p className="pb-10 text-center text-sm text-muted-foreground" role="status">
          {status}
        </p>
      )}
    </div>
  )
}
