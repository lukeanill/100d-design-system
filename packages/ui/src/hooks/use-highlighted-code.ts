import * as React from "react"

import { highlightCode } from "@workspace/ui/lib/highlighter"

/** One node per line: plain text until highlighting has loaded, and for a language that is not listed. */
export function useHighlightedCode(value: string, language: string): React.ReactNode[] {
  const code = value.endsWith("\n") ? value.slice(0, -1) : value
  const [result, setResult] = React.useState<{ code: string; language: string; lines: React.ReactNode[] } | null>(null)

  React.useEffect(() => {
    let cancelled = false
    highlightCode(code, language)
      .then((lines) => {
        if (!cancelled && lines) setResult({ code, language, lines })
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [code, language])

  return result && result.code === code && result.language === language ? result.lines : code.split("\n")
}
