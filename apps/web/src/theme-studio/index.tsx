import { useEffect, useState } from "react"

import { Button } from "@workspace/ui/components/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@workspace/ui/components/input-otp"
import {
  ToastList,
  ToastProvider,
  ToastViewport,
  toast,
} from "@workspace/ui/components/toast"
import {
  clearKey,
  listThemes,
  reorderThemes,
  saveTheme,
  setKey,
  setThemeArchived,
  type Theme,
  type ThemesResponse,
} from "./api"
import { ThemeEditor } from "./ThemeEditor"
import { ThemeList } from "./ThemeList"

/* Theme manager. Seeds in, full palette out: four colours, three fonts and an
 * edge preset, with every other token derived. Derivation aims at the contrast
 * rules but does not enforce them: a pair that lands below is shown and then
 * left to the designer.
 *
 * Runs in two places. On localhost it writes to your working copy, and the
 * change reaches the site when you commit and push. On the deployed site it
 * commits for you, and Vercel redeploys — which is the whole reason it is
 * hosted. The save message says which of the two you just wrote to. */

/** The code is six digits. It is checked on the server, never here. */
const CODE_LENGTH = 6

function Lock({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [checking, setChecking] = useState(false)

  const submit = async (code: string) => {
    if (code.length !== CODE_LENGTH || checking) return
    setChecking(true)
    setKey(code)
    try {
      await listThemes()
      onUnlock()
    } catch (e) {
      clearKey()
      setValue("")
      setError(e instanceof Error ? e.message : "Could not unlock.")
    } finally {
      setChecking(false)
    }
  }

  return (
    // matches the studio: light regardless of the app's current theme
    <div className="flex min-h-screen items-center justify-center bg-white p-6 text-neutral-900">
      <form
        onSubmit={(event) => {
          event.preventDefault()
          void submit(value)
        }}
        className="flex w-80 flex-col items-center gap-4"
      >
        <InputOTP
          maxLength={CODE_LENGTH}
          value={value}
          onChange={(next) => {
            setValue(next)
            setError(null)
          }}
          // digits only, and the code is tried as soon as the last one is in
          pattern="^[0-9]*$"
          inputMode="numeric"
          onComplete={(code) => void submit(code)}
          disabled={checking}
          aria-label="Theme studio code"
          autoFocus
        >
          <InputOTPGroup>
            {Array.from({ length: CODE_LENGTH }).map((_, i) => (
              <InputOTPSlot
                key={i}
                index={i}
                // the lock is light whatever theme the app is in, so the slot
                // is painted directly rather than from the theme's tokens
                className="border-neutral-300 bg-white text-neutral-900"
                aria-invalid={error ? true : undefined}
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
        {error && (
          <p className="text-center text-sm whitespace-pre-line text-destructive">
            {error}
          </p>
        )}
        <Button type="submit" disabled={value.length !== CODE_LENGTH || checking}>
          Unlock
        </Button>
      </form>
    </div>
  )
}

export function ThemeStudio() {
  const [unlocked, setUnlocked] = useState(false)
  const [themes, setThemes] = useState<Theme[]>([])
  const [editing, setEditing] = useState<Theme | null | "new">(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!unlocked) return
    listThemes()
      .then((d) => setThemes(d.themes))
      .catch((e) => toast.add({ type: "error", title: e.message }))
  }, [unlocked])

  /* A save on the deployed studio is not finished when the request returns —
   * it is a commit, and the site catches up when the build does. Say so, rather
   * than letting "Saved" imply the site already changed.
   *
   * Contrast rides along as a note. It never stops a save, but the numbers are
   * worth seeing, so they are appended rather than hidden. */
  const outcome = (data: ThemesResponse, message: string) => {
    const deployed = data.deploying
      ? `Committed to ${data.branch ?? "the repo"} — the site rebuilds in a minute or two.`
      : undefined
    const contrast =
      data.belowContrast && data.contrast ? data.contrast : undefined
    return {
      title: message,
      description:
        [deployed, contrast].filter(Boolean).join("\n\n") || undefined,
    }
  }

  const run = async (
    action: () => Promise<ThemesResponse>,
    message: string
  ) => {
    setBusy(true)
    try {
      const data = await action()
      setThemes(data.themes)
      toast.add({ type: "success", ...outcome(data, message) })
      return true
    } catch (e) {
      toast.add({
        type: "error",
        title: e instanceof Error ? e.message : "Something went wrong.",
      })
      return false
    } finally {
      setBusy(false)
    }
  }

  if (!unlocked) return <Lock onUnlock={() => setUnlocked(true)} />

  /* The studio is always light, whatever theme the app is set to. Themes are
   * applied as a class on <html>, so rather than fight the cascade we paint the
   * light theme's own tokens onto this subtree. */
  const lightTokens =
    themes.find((t) => t.selector === ":root")?.tokens ??
    themes.find((t) => t.name === "lighten-up")?.tokens ??
    {}
  const lightStyle = Object.fromEntries(
    Object.entries(lightTokens).map(([token, value]) => [`--${token}`, value])
  ) as React.CSSProperties

  return (
    <ToastProvider toastManager={toast}>
      <div
        style={lightStyle}
        className="min-h-screen bg-background text-foreground"
      >
        {editing ? (
          <ThemeEditor
            theme={editing === "new" ? null : editing}
            busy={busy}
            onCancel={() => setEditing(null)}
            onSave={async (theme) => {
              const ok = await run(
                () => saveTheme(theme),
                `Saved ${theme.label ?? theme.name}.`
              )
              if (ok) setEditing(null)
            }}
          />
        ) : (
          <ThemeList
            themes={themes}
            onNew={() => setEditing("new")}
            onEdit={(theme) => setEditing(theme)}
            onArchive={(theme) =>
              run(
                () => setThemeArchived(theme.name, true),
                `Archived ${theme.label}.`
              )
            }
            onUnarchive={(theme) =>
              run(
                () => setThemeArchived(theme.name, false),
                `Restored ${theme.label}.`
              )
            }
            onReorder={(names) => {
              // optimistic: the rows should follow the pointer, not the round trip
              setThemes((prev) =>
                names.flatMap((n) => prev.find((t) => t.name === n) ?? [])
              )
              void run(() => reorderThemes(names), "Order saved.")
            }}
          />
        )}

        {/* Rendered here rather than portalled to <body> so toasts pick up the
          studio's light tokens instead of the app's current theme. */}
        <ToastViewport>
          <ToastList />
        </ToastViewport>
      </div>
    </ToastProvider>
  )
}
