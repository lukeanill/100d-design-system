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
 * The preview is the site's own og:image and favicon rather than a screenshot:
 * a real screenshot needs a headless browser, which a serverless function
 * cannot practically run, and og:image is a real image the site chose to
 * represent itself.
 */
export function SiteImport({ onPulled }: { onPulled: (pulled: PulledTheme) => void }) {
  const [url, setUrl] = useState("")
  const [result, setResult] = useState<PulledTheme | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const pull = async () => {
    if (!url.trim() || busy) return
    setBusy(true)
    setError(null)
    try {
      const pulled = await pullTheme(url)
      setResult(pulled)
      onPulled(pulled)
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
  }

  const summary = (pulled: PulledTheme) => {
    const colours = Object.values(pulled.seeds).filter(Boolean).length
    const parts = [`Found ${colours} colour${colours === 1 ? "" : "s"} to review.`]
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
            {busy ? "Reading…" : "Pull Theme"}
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
            {result.preview.ogImage && (
              <img
                src={result.preview.ogImage}
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
          <p className="min-w-56 flex-1 text-sm text-muted-foreground">{summary(result)}</p>
        </div>
      )}
    </section>
  )
}
