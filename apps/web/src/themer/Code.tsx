import { useMemo } from "react"

import { GlassLayer } from "@workspace/ui/components/liquid-glass"
import { cn } from "@workspace/ui/lib/utils"

import { ActionButton, BackButton, Header, HomeButton, Page, PageTitle } from "./Chrome"

type Kind = "comment" | "prop" | "value" | "plain"
interface Piece {
  text: string
  kind: Kind
}

const COLORS: Record<Kind, string> = {
  comment: "#4f5fd6",
  prop: "#22a346",
  value: "#c4491c",
  plain: "#ffffff",
}

/** A line at a time: comments blue, property names green, values rust, the rest white. */
function tokenize(code: string): Piece[][] {
  let inComment = false
  return code.split("\n").map((line) => {
    if (inComment) {
      if (line.includes("*/")) inComment = false
      return [{ text: line, kind: "comment" as Kind }]
    }
    const open = line.indexOf("/*")
    if (open !== -1 && line.slice(open).indexOf("*/") === -1) {
      inComment = true
      return [{ text: line, kind: "comment" as Kind }]
    }
    if (open !== -1) return [{ text: line, kind: "comment" as Kind }]
    const m = /^(\s*)(--?[\w-]+|color-scheme)(:\s*)(.*?)(;?)$/.exec(line)
    if (m) {
      return [
        { text: m[1], kind: "plain" as Kind },
        { text: m[2], kind: "prop" as Kind },
        { text: m[3], kind: "plain" as Kind },
        { text: m[4], kind: "value" as Kind },
        { text: m[5], kind: "plain" as Kind },
      ]
    }
    return [{ text: line, kind: "plain" as Kind }]
  })
}

export function CodePanel({ code, numbered }: { code: string; numbered?: boolean }) {
  const lines = useMemo(() => tokenize(code), [code])
  return (
    <div className="relative isolate rounded-2xl border border-white/15">
      <GlassLayer weight="medium" tint="rgba(27, 27, 27, 0.9)" radius={16} />
      <div
        className="relative overflow-auto rounded-2xl px-10 py-12 max-sm:px-4 max-sm:py-6"
        style={{ maxHeight: "min(780px, 75vh)" }}
      >
        <pre className="font-mono text-[13px] leading-[23px] text-white" tabIndex={0} aria-label="Theme code">
          {lines.map((pieces, i) => (
            <div key={i} className="flex">
              {numbered && <span aria-hidden className="w-24 shrink-0 select-none text-white/90 max-sm:w-10">{i + 1}</span>}
              <span className="whitespace-pre">
                {pieces.map((p, j) => (
                  <span key={j} style={{ color: COLORS[p.kind] }}>
                    {p.text}
                  </span>
                ))}
                {pieces.length === 0 && " "}
              </span>
            </div>
          ))}
        </pre>
      </div>
    </div>
  )
}

/** Get the Code: the template, numbered, with Download. */
export function CodeScreen({ code, onHome, onDownload }: { code: string; onHome: () => void; onDownload: () => void }) {
  return (
    <Page glow="glow-code">
      <Header nav={<HomeButton onClick={onHome} />} actions={<ActionButton onClick={onDownload}>Download</ActionButton>} />
      <PageTitle>Theme Code</PageTitle>
      <CodePanel code={code} numbered />
    </Page>
  )
}

/** My theme: the code for the theme just made, with Download and Exit. */
export function MyThemeScreen({
  code,
  onBack,
  onDownload,
  onExit,
}: {
  code: string
  onBack: () => void
  onDownload: () => void
  onExit: () => void
}) {
  return (
    <Page glow={false}>
      <Header
        nav={<BackButton onClick={onBack} />}
        actions={
          <>
            <ActionButton onClick={onDownload}>Download</ActionButton>
            <ActionButton onClick={onExit} className={cn("")}>Exit</ActionButton>
          </>
        }
      />
      <h3 className="mb-[60px] pt-8 text-center text-[28px] leading-[1.14]">Get your theme code</h3>
      <CodePanel code={code} />
    </Page>
  )
}
