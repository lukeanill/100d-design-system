import { useState } from "react"

import { Button } from "@workspace/ui/components/button"
import { pullTheme, type PulledTheme } from "./api"

/**
 * Read a website and fill the editor from it.
 *
 * Two states, as designed: an address to type, and — once pulled — the site it
 * read with a preview and a plain account of what it found. Everything it
 * produces is a starting point the designer then corrects, so the panel says
 * what it guessed and what it swapped rather than quietly filling the fields
 * and leaving you to notice.
 *
 * The preview is the screenshot the colours were read from, so what you see is
 * what the seeds describe. When the screenshot fails it falls back to the
 * site's og:image, and the summary says which the colours came from.
 */
export function SiteImport({
  onPulled,
  confirm = false,
}: {
  onPulled: (pulled: PulledTheme) => void
  /** On an existing theme, show what was found and wait for Apply rather
   *  than overwriting a palette someone already chose. */
  confirm?: boolean
}) {
  const [url, setUrl] = useState("")
  const [result, setResult] = useState<PulledTheme | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [applied, setApplied] = useState(false)

  const pull = async () => {
    if (!url.trim() || busy) return
    setBusy(true)
    setError(null)
    try {
      const pulled = await pullTheme(url)
      setResult(pulled)
      setApplied(!confirm)
      if (!confirm) onPulled(pulled)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read that site.")
    } finally {
      setBusy(false)
    }
  }

  const reset = () => {
    setUrl("")
    setResult(null)
    setError(null)
    setApplied(false)
  }

  const summary = (pulled: PulledTheme) => {
    const colours = Object.values(pulled.seeds).filter(Boolean).length
    const from =
      pulled.colorSource === "screenshot"
        ? "from a screenshot of the page"
        : pulled.colorSource === "image"
          ? "from the site's preview image (the screenshot failed)"
          : "from its CSS (the screenshot failed)"
    const parts = [`Found ${colours} colour${colours === 1 ? "" : "s"} ${from}.`]
    if (pulled.substituted.length) {
      const swaps = pulled.substituted
        .map((s) => `${s.found} → ${s.using}`)
        .slice(0, 3)
        .join(", ")
      parts.push(`The site uses custom fonts, so these were swapped for Google faces: ${swaps}.`)
    } else if (pulled.googleFamilies.length) {
      parts.push(`Its fonts are already on Google: ${pulled.googleFamilies.join(", ")}.`)
    }
    return parts.join(" ")
  }

  return (
    <section className="rounded-2xl border border-border p-6">
      <div className="flex items-end gap-4">
        <input
          value={result ? result.url : url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              void pull()
            }
          }}
          readOnly={Boolean(result)}
          placeholder="Generate from URL"
          aria-label="Website address to generate a theme from"
          className="w-full min-w-0 flex-1 border-b border-dashed border-foreground/40 bg-transparent pb-2 text-2xl font-light outline-none placeholder:text-foreground/30 focus-visible:border-foreground"
        />
        {result ? (
          <Button onClick={reset}>Reset</Button>
        ) : (
          <Button onClick={pull} disabled={!url.trim() || busy}>
            {busy ? "Taking a screenshot…" : "Pull Theme"}
          </Button>
        )}
      </div>

      {error && (
        <p className="mt-4 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-6 flex flex-wrap items-start gap-6">
          <div className="flex shrink-0 gap-3">
            {(result.preview.screenshot ?? result.preview.ogImage) && (
              <img
                src={result.preview.screenshot ?? result.preview.ogImage ?? undefined}
                alt=""
                className="h-28 w-44 rounded-lg border border-border object-cover"
                // a preview that 404s should leave a gap, not a broken icon
                onError={(e) => e.currentTarget.remove()}
              />
            )}
            {result.preview.favicon && (
              <img
                src={result.preview.favicon}
                alt=""
                className="size-12 rounded-lg border border-border object-contain p-1"
                onError={(e) => e.currentTarget.remove()}
              />
            )}
          </div>
          <div className="flex min-w-56 flex-1 flex-col gap-4">
            <p className="text-sm text-muted-foreground">{summary(result)}</p>
            <div className="flex flex-wrap items-center gap-3">
              {(["background", "foreground", "primary", "secondary"] as const).map(
                (role) =>
                  result.seeds[role] && (
                    <span key={role} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span
                        className="size-5 rounded-full border border-border"
                        style={{ background: result.seeds[role] }}
                      />
                      <span className="capitalize">{role}</span>
                      <code>{result.seeds[role]}</code>
                    </span>
                  )
              )}
              {!applied && (
                <Button
                  size="sm"
                  onClick={() => {
                    onPulled(result)
                    setApplied(true)
                  }}
                >
                  Apply to this theme
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
