import { useEffect, useMemo, useRef, useState } from "react"

import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import type { ThemeDraft } from "@workspace/ui/themes"

import { ActionButton, BackButton, Header, Page } from "./Chrome"
import { checkFont, loadPickerFonts } from "./fontLoading"
import { OPTIONS, draftToText, randomDraft, textToDraft, type LineError } from "./options"
import { ProductPreview } from "./ProductPreview"
import { emptyDraft, feelMissing, lookMissing, valuesMissing } from "./state"

export type Stage = "design" | "preview"

const LINE = 23

const COLORS = { comment: "#4f5fd6", prop: "#22a346", value: "#c4491c", plain: "#ffffff" }

/** One line of the code block: comments blue, option names green, what is typed rust. */
function Line({ text, inComment }: { text: string; inComment: boolean }) {
  if (inComment || /^\s*\/\*/.test(text)) return <span style={{ color: COLORS.comment }}>{text || " "}</span>
  const m = /^(\s*)([^:]+)(:)(.*)$/.exec(text)
  if (!m) return <span style={{ color: COLORS.plain }}>{text || " "}</span>
  return (
    <>
      <span style={{ color: COLORS.plain }}>{m[1]}</span>
      <span style={{ color: COLORS.prop }}>{m[2]}</span>
      <span style={{ color: COLORS.plain }}>{m[3]}</span>
      <span style={{ color: COLORS.value }}>{m[4]}</span>
    </>
  )
}

/**
 * The code block, as an editor: a textarea laid exactly over a highlighted copy of its own text, so
 * it is typed in like any field and read like code. A line that cannot be read is tinted red.
 */
function CodeEditor({ text, onChange, errors }: { text: string; onChange: (t: string) => void; errors: LineError[] }) {
  const lines = text.split("\n")
  const bad = new Set(errors.map((e) => e.line))
  let open = false
  return (
    // a plain colour fill, not glass: the Figma's alpha/dark/lg (#1e1e1e at 32%)
    <div className="relative isolate min-h-0 flex-1 rounded-2xl border border-white/10 bg-(--alpha-dark-lg)">
      <div className="absolute inset-0 overflow-auto rounded-2xl p-6 max-sm:p-3">
        <div className="relative w-max min-w-full">
          <pre aria-hidden className="font-mono text-[13px] text-white" style={{ lineHeight: `${LINE}px` }}>
            {lines.map((l, i) => {
              const inComment = open
              if (open && l.includes("*/")) open = false
              else if (!open && l.includes("/*") && !l.includes("*/")) open = true
              return (
                <div key={i} className={cn("whitespace-pre", bad.has(i + 1) && "bg-red-500/20")} style={{ height: LINE }}>
                  <Line text={l} inComment={inComment} />
                </div>
              )
            })}
          </pre>
          <textarea
            aria-label="Your theme choices"
            value={text}
            onChange={(e) => onChange(e.target.value)}
            wrap="off"
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            className="absolute inset-0 size-full resize-none overflow-hidden whitespace-pre bg-transparent font-mono text-[13px] text-transparent caret-white outline-none selection:bg-white/25"
            style={{ lineHeight: `${LINE}px` }}
          />
        </div>
      </div>
    </div>
  )
}

/** What is still to do before Continue: every option with an answer, and no line that cannot be read. */
export const designGap = (d: ThemeDraft, errors: LineError[]) => [
  ...errors.map((e) => `${e.name} (line ${e.line})`),
  ...lookMissing(d),
  ...feelMissing(d),
  ...valuesMissing(d).map((_, i) => OPTIONS.find((o) => o.field === `values.${i}`)!.name),
]

export function Design({
  draft,
  onChange,
  stage,
  onStage,
  onBack,
  onContinue,
}: {
  draft: ThemeDraft
  onChange: (patch: Partial<ThemeDraft>) => void
  stage: Stage
  onStage: (s: Stage) => void
  onBack: () => void
  onContinue: () => void
}) {
  // the text is the editor's own while it is being typed in; it starts from whatever the draft already holds
  const [text, setText] = useState(() => draftToText(draft))
  const [errors, setErrors] = useState<LineError[]>([])
  const draftRef = useRef(draft)
  draftRef.current = draft

  const edit = (next: string) => {
    setText(next)
    const read = textToDraft(next, draftRef.current)
    setErrors(read.errors)
    onChange(read.draft)
  }

  useEffect(() => {
    void loadPickerFonts()
  }, [])
  useEffect(() => {
    if (draft.headingFont) void checkFont(draft.headingFont, draft.headingWeight ?? 400)
  }, [draft.headingFont, draft.headingWeight])
  useEffect(() => {
    if (draft.bodyFont) void checkFont(draft.bodyFont, draft.bodyWeight ?? 400)
  }, [draft.bodyFont, draft.bodyWeight])

  const gap = useMemo(() => designGap(draft, errors), [draft, errors])

  // Random fills every answer; the button then becomes Clear, which empties them again. Both go through
  // the editor's own text, so what is on screen is always what was read.
  const [filled, setFilled] = useState(false)
  const randomOrClear = () => {
    edit(draftToText(filled ? emptyDraft() : randomDraft()))
    setFilled(!filled)
  }

  const word = (id: Stage, label: string) => (
    <button
      type="button"
      role="tab"
      aria-selected={stage === id}
      onClick={() => onStage(id)}
      className={cn("cursor-pointer text-base leading-[1.42] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50", stage !== id && "opacity-50")}
    >
      {label}
    </button>
  )

  return (
    <Page glow="glow-code" wide fill={stage === "design"} flush={stage !== "design"}>
      <Header
        nav={<BackButton onClick={onBack} />}
        center={
          <div role="tablist" className="flex items-center justify-center gap-6">
            {word("design", "Design")}
            {word("preview", "Preview")}
          </div>
        }
        actions={
          <ActionButton onClick={onContinue} disabled={gap.length > 0} title={gap.length ? `Still to do: ${gap.join(", ")}` : undefined}>
            Continue
          </ActionButton>
        }
      />
      {stage === "design" ? (
        <div className="mx-auto flex min-h-0 w-full max-w-[800px] flex-1 flex-col">
          {/* the title always in the middle, Random at the right edge: the title keeps clear of the button and wraps if it must */}
          {/* the padding is PageTitle's (32 above, 60 below), so the spacing matches the other screens */}
          <div className="shrink-0 pt-8 pb-[60px]">
            <div className="relative flex min-h-10 items-center justify-center">
              <h3 className="px-[7.25rem] text-center text-[48px] leading-[1.22] max-sm:text-[32px]">Create a Theme</h3>
              <Button variant="secondary" onClick={randomOrClear} className="absolute top-1/2 right-0 h-10 shrink-0 -translate-y-1/2 rounded-[12px] bg-secondary/50 px-5 text-base leading-none hover:bg-secondary/60">
                {filled ? "Clear" : "Random"}
              </Button>
            </div>
          </div>
          <CodeEditor text={text} onChange={edit} errors={errors} />
          {errors.length > 0 && (
            <ul role="alert" className="mt-4 flex shrink-0 flex-col gap-1 text-sm text-red-400">
              {errors.map((e) => (
                <li key={e.line}>
                  Line {e.line}: {e.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <ProductPreview draft={draft} />
      )}
    </Page>
  )
}
