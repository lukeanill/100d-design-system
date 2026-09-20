import { useEffect, useState } from "react"

/**
 * Loads a Google family and reports whether it actually resolved — the
 * checkmark in the designs. Verified with document.fonts.check rather than a
 * naive "the stylesheet loaded", so a typo'd family reads as unresolved
 * instead of silently falling back to a system face.
 */
export function useGoogleFont(family: string | undefined) {
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "missing">("idle")

  useEffect(() => {
    const name = family?.trim()
    if (!name) {
      setStatus("idle")
      return
    }

    setStatus("loading")
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(name).replace(
      /%20/g,
      "+"
    )}:wght@300;400;500;700&display=swap`
    document.head.appendChild(link)

    let cancelled = false
    const verify = async () => {
      try {
        await document.fonts.load(`400 16px '${name}'`)
        if (!cancelled) setStatus(document.fonts.check(`400 16px '${name}'`) ? "ready" : "missing")
      } catch {
        if (!cancelled) setStatus("missing")
      }
    }
    // give the stylesheet a moment to arrive before asking
    const timer = setTimeout(verify, 300)

    return () => {
      cancelled = true
      clearTimeout(timer)
      link.remove()
    }
  }, [family])

  return status
}
