"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import type { ReactNode } from "react"
import { ArrowUp, Check, ChevronDown, File, Globe, Layers, LineChart, Mic, Paperclip, Plus, X } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"

/* A composer with real controls: attach, @ data sources, / commands, a model
 * picker, and dictation. Type @ or / to open the menus; ↑↓ + Enter to pick.
 * Ported from beautifui.dev (the decorative rainbow shader sweep on model
 * change was dropped — it depended on an external canvas-shader package). */

const GLYPHS: Record<string, ReactNode> = {
  chart: <LineChart className="size-3.5" strokeWidth={1.8} />,
  clip: <Paperclip className="size-3.5" strokeWidth={1.8} />,
  globe: <Globe className="size-3.5" strokeWidth={1.8} />,
  layers: <Layers className="size-3.5" strokeWidth={1.8} />,
}

type Source = {
  key: string
  name: string
  desc: string
  glyph?: string
  attach?: boolean
  connect?: boolean
}

const SOURCES: Source[] = [
  { attach: true, desc: "Upload from your computer", glyph: "clip", key: "attach", name: "Add photos & files" },
  { desc: "Sales & churn metrics", glyph: "chart", key: "scoop", name: "Scoop Data" },
  { desc: "26 makers, tags, links", glyph: "layers", key: "flavors", name: "Flavor records" },
  { desc: "Real-time news and info", glyph: "globe", key: "web", name: "Web search" },
  { connect: true, desc: "Read and manage Gmail", glyph: "layers", key: "gmail", name: "Gmail" },
]

const COMMANDS = [
  { desc: "Flavor vs. last summer", key: "compare", name: "/compare" },
  { desc: "Draft a churn schedule", key: "churn-plan", name: "/churn-plan" },
  { desc: "Build a reorder list", key: "restock", name: "/restock" },
  { desc: "Write a supplier email", key: "draft-email", name: "/draft-email" },
  { desc: "Digest the thread so far", key: "summarize", name: "/summarize" },
]

const MODELS = [
  { key: "sprinkles-5", name: "Sprinkles 5", tag: "Flagship" },
  { key: "vanilla-1", name: "Vanilla 1", tag: "Basic" },
  { key: "freezer-burn", name: "Freezer Burn 0.4", tag: "Stale" },
]

const FILES = ["flavor-chart.png", "summer-menu.pdf", "pos-export.csv"]
const DICTATION = "Compare pistachio weekends to last summer"

const AUTO_STEPS: { draft: string; active?: number; connect?: boolean; modelOpen?: boolean; model?: string; hold: number }[] = [
  { connect: false, draft: "", hold: 1100, model: "vanilla-1" },
  { active: 0, draft: "@", hold: 900 },
  { active: 1, draft: "@", hold: 620 },
  { active: 3, draft: "@", hold: 620 },
  { active: 4, draft: "@", hold: 700 },
  { active: 4, connect: true, draft: "@", hold: 1000 },
  { draft: "", hold: 700 },
  { active: 0, draft: "/", hold: 900 },
  { active: 1, draft: "/", hold: 620 },
  { active: 3, draft: "/", hold: 1000 },
  { draft: "", hold: 800 },
  { draft: "", hold: 1200, modelOpen: true },
  { draft: "", hold: 2400, model: "sprinkles-5" },
  { draft: "", hold: 900 },
]

function parseToken(draft: string): { kind: "at" | "slash"; query: string; start: number } | null {
  const match = /(^|\s)([@/])([\w-]*)$/.exec(draft)
  if (!match) return null
  return { kind: match[2] === "@" ? "at" : "slash", query: match[3].toLowerCase(), start: match.index + match[1].length }
}

export interface PromptBarProps {
  appearance?: {
    variant?: "Rounded" | "Pill"
    demo?: boolean
    tall?: boolean
  }
  data?: {
    placeholder?: string
  }
  actions?: {
    onSend?: (text: string) => void
  }
}

export const PromptBar = ({ appearance, data, actions }: PromptBarProps = {}) => {
  const pill = (appearance?.variant ?? "Rounded") === "Pill"
  const demo = appearance?.demo ?? true
  const tall = appearance?.tall ?? false
  const placeholder = data?.placeholder

  const [draft, setDraft] = useState("")
  const [dismissed, setDismissed] = useState(false)
  const [plusOpen, setPlusOpen] = useState(false)
  const [modelOpen, setModelOpen] = useState(false)
  const [model, setModel] = useState(MODELS[1])
  const [attachments, setAttachments] = useState<string[]>([])
  const [connected, setConnected] = useState(false)
  const [active, setActive] = useState(0)
  const [listening, setListening] = useState(false)
  const [auto, setAuto] = useState(demo)
  const [autoStep, setAutoStep] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const wide = expanded || tall
  const [rowBox, setRowBox] = useState<{ top: number; height: number } | null>(null)
  const [engaged, setEngaged] = useState(false)
  const [modelHovered, setModelHovered] = useState<number | null>(null)
  const composerAnchorRef = useRef<HTMLDivElement>(null)
  const controlsRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const measureRef = useRef<HTMLSpanElement>(null)
  const modelRef = useRef<HTMLButtonElement>(null)
  const rowRefs = useRef<(HTMLButtonElement | null)[]>([])

  const takeOver = (event: { target: EventTarget | null }) => {
    setAuto(false)
    if (auto && event.target === inputRef.current) setDraft("")
  }

  const token = dismissed ? null : parseToken(draft)
  const menu: "at" | "slash" | null = plusOpen ? "at" : (token?.kind ?? null)
  const query = plusOpen ? "" : (token?.query ?? "")

  const rows: { key: string; name: string; desc: string }[] =
    menu === "at" ? SOURCES.filter((s) => s.name.toLowerCase().includes(query)) : menu === "slash" ? COMMANDS.filter((c) => c.name.slice(1).startsWith(query)) : []

  useEffect(() => {
    setActive(0)
    setEngaged(false)
  }, [menu, query])

  useLayoutEffect(() => {
    const target = rowRefs.current[active]
    if (target) setRowBox({ height: target.offsetHeight, top: target.offsetTop })
  }, [menu, query, active, connected, rows.length])

  useEffect(() => {
    if (!modelOpen) setModelHovered(null)
  }, [modelOpen])

  const selectModel = (next: (typeof MODELS)[number]) => {
    setModel(next)
    setModelOpen(false)
  }

  useEffect(() => {
    if (!auto) return
    const step = AUTO_STEPS[autoStep % AUTO_STEPS.length]
    setDraft(step.draft)
    if (step.active !== undefined) setActive(step.active)
    if (step.connect !== undefined) setConnected(step.connect)
    if (step.modelOpen !== undefined) setModelOpen(step.modelOpen)
    if (step.model) {
      const next = MODELS.find((m) => m.key === step.model)
      if (next) selectModel(next)
    }
    const t = setTimeout(() => setAutoStep((s) => s + 1), step.hold)
    return () => clearTimeout(t)
  }, [auto, autoStep])

  useEffect(() => {
    if (!listening) return
    const t = setTimeout(() => {
      setDraft((current) => (current ? `${current.trimEnd()} ${DICTATION}` : DICTATION))
      setListening(false)
      inputRef.current?.focus()
    }, 2200)
    return () => clearTimeout(t)
  }, [listening])

  useLayoutEffect(() => {
    const input = inputRef.current
    const controls = controlsRef.current
    const measure = measureRef.current
    const modelButton = modelRef.current
    if (!input || !controls || !measure || !modelButton) return

    const fixedControlsWidth = 28 * 3 + modelButton.offsetWidth
    const inlineGaps = 4 * 4
    const inlineInputWidth = controls.clientWidth - fixedControlsWidth - inlineGaps
    const needsFullWidth = draft.includes("\n") || measure.offsetWidth + 8 > inlineInputWidth
    if (needsFullWidth !== expanded) setExpanded(needsFullWidth)

    const minHeight = 28
    const maxHeight = 100
    input.style.height = "0px"
    const contentHeight = input.scrollHeight
    input.style.height = `${Math.min(Math.max(contentHeight, minHeight), maxHeight)}px`
    input.style.overflowY = contentHeight > maxHeight ? "auto" : "hidden"
  }, [draft, expanded])

  useEffect(() => {
    if (!modelOpen && !plusOpen) return
    const close = (event: PointerEvent) => {
      if (!(event.target as Element).closest("[data-promptbar]")) {
        setModelOpen(false)
        setPlusOpen(false)
      }
    }
    document.addEventListener("pointerdown", close)
    return () => document.removeEventListener("pointerdown", close)
  }, [modelOpen, plusOpen])

  const closeMenus = () => {
    setPlusOpen(false)
    setModelOpen(false)
  }

  const pick = (row: { key: string; name: string }) => {
    const source = SOURCES.find((s) => s.key === row.key)
    if (source?.attach) {
      setAttachments((current) => [...current, FILES[current.length % FILES.length]])
      if (token) setDraft(draft.slice(0, token.start))
    } else if (menu === "at") {
      setDraft(`${token ? draft.slice(0, token.start) : draft}@${row.name} `)
    } else {
      setDraft(`${token ? draft.slice(0, token.start) : draft}${row.name} `)
    }
    setPlusOpen(false)
    setDismissed(false)
    inputRef.current?.focus()
  }

  const canSend = draft.trim().length > 0 || attachments.length > 0
  const send = () => {
    if (!canSend) return
    actions?.onSend?.(draft.trim())
    setDraft("")
    setAttachments([])
    closeMenus()
  }

  return (
    <div data-promptbar className={demo ? "flex min-h-[384px] w-full max-w-105 flex-col justify-end pb-8" : "w-full"} onPointerDownCapture={takeOver} onKeyDownCapture={takeOver}>
      <div ref={composerAnchorRef} className="relative">
        {menu && (
          <div
            onMouseLeave={() => setEngaged(false)}
            className="absolute inset-x-0 bottom-full z-10 mb-2 rounded-lg bg-card p-1 shadow-lg ring-1 ring-foreground/10"
            style={{ animation: "pop-in 180ms cubic-bezier(0.23,1,0.32,1) both", transformOrigin: "bottom center" }}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-1 rounded-md bg-muted"
              style={{
                height: rowBox?.height ?? 0,
                opacity: rowBox && engaged && rows.length > 0 ? 1 : 0,
                top: rowBox?.top ?? 0,
                transition: "top 220ms cubic-bezier(0.23,1,0.32,1), height 220ms cubic-bezier(0.23,1,0.32,1), opacity 150ms ease",
              }}
            />
            {rows.map((row, i) => {
              const source = menu === "at" ? SOURCES.find((s) => s.key === row.key) : undefined
              return (
                <button
                  key={row.key}
                  type="button"
                  ref={(el) => {
                    rowRefs.current[i] = el
                  }}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => {
                    setActive(i)
                    setEngaged(true)
                  }}
                  onClick={() => pick(row)}
                  className="relative z-10 flex h-9 w-full items-center gap-2.5 rounded-md px-2 text-left"
                >
                  {source && <span className="flex size-5.5 shrink-0 items-center justify-center text-foreground/75">{GLYPHS[source.glyph ?? "clip"]}</span>}
                  <span className="shrink-0 text-[12.5px] font-medium text-foreground">{row.name}</span>
                  <span className="min-w-0 flex-1 truncate text-[12px] text-foreground/75">{row.desc}</span>
                  {source?.connect && (
                    <span
                      role="button"
                      tabIndex={-1}
                      onClick={(event) => {
                        event.stopPropagation()
                        setConnected((current) => !current)
                      }}
                      className={cn("shrink-0 text-[12px] font-medium transition-colors duration-100", connected ? "text-affirmative" : "text-primary hover:underline")}
                    >
                      {connected ? "Connected" : "Connect"}
                    </span>
                  )}
                </button>
              )
            })}
            {rows.length === 0 && <div className="flex h-9 items-center px-2 text-[12px] text-foreground/75">No matches for "{query}"</div>}
            <div className="mt-1 border-t border-border px-2 pt-1.5 pb-1 text-[11px] text-foreground/75">{menu === "at" ? "Type to search sources & files" : "Type to search commands"}</div>
          </div>
        )}

        {modelOpen && (
          <div
            onMouseLeave={() => setModelHovered(null)}
            className="absolute bottom-full left-0 z-10 mb-2 w-44 rounded-lg bg-card p-1 shadow-lg ring-1 ring-foreground/10"
            style={{ animation: "pop-in 180ms cubic-bezier(0.23,1,0.32,1) both", transformOrigin: "bottom left" }}
          >
            {MODELS.map((m, i) => (
              <button
                key={m.key}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setModelHovered(i)}
                onClick={() => {
                  selectModel(m)
                  inputRef.current?.focus()
                }}
                className={cn("relative z-10 flex h-7.5 w-full items-center gap-2 rounded-md px-2 text-left", modelHovered === i && "bg-muted")}
              >
                <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-foreground">{m.name}</span>
                <span className="shrink-0 text-[11px] text-foreground/75">{m.tag}</span>
                <span className={cn("shrink-0 text-foreground", m.key === model.key ? "" : "invisible")}>
                  <Check className="size-3" strokeWidth={2.5} />
                </span>
              </button>
            ))}
          </div>
        )}

        <div
          className={cn(
            "relative isolate flex flex-col overflow-hidden border border-border bg-card shadow-xs transition-[border-color,border-radius] duration-150 focus-within:border-foreground/20",
            tall ? "gap-2.5 p-3.5" : "gap-1.5 p-1.5",
            pill ? (attachments.length > 0 || wide ? "rounded-3xl" : "rounded-full") : tall ? "rounded-2xl" : "rounded-2xl"
          )}
        >
          <span ref={measureRef} aria-hidden="true" className="pointer-events-none invisible absolute text-[13px] leading-[18px] whitespace-pre">
            {draft}
          </span>

          {attachments.length > 0 && (
            <div className={cn("flex flex-wrap gap-1.5 pt-0.5", pill ? "px-1" : "px-0.5")}>
              {attachments.map((file, i) => (
                <span
                  key={`${file}-${i}`}
                  className={cn("flex h-6.5 items-center gap-1.5 bg-muted py-1 pr-1 pl-1.5 text-[11.5px] text-foreground/75 ring-1 ring-foreground/10", pill ? "rounded-full" : "rounded-md")}
                  style={{ animation: "pop-in 200ms cubic-bezier(0.23,1,0.32,1) both" }}
                >
                  <File className="size-3" strokeWidth={1.8} />
                  <span className="max-w-36 truncate">{file}</span>
                  <button
                    type="button"
                    aria-label={`Remove ${file}`}
                    onClick={() => setAttachments((current) => current.filter((_, j) => j !== i))}
                    className={cn("-my-1 flex size-6 items-center justify-center text-foreground/75 transition-colors duration-100 hover:bg-border hover:text-foreground", pill ? "rounded-full" : "rounded-[5px]")}
                  >
                    <X className="size-2.5" strokeWidth={2.5} />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div ref={controlsRef} className={cn("grid items-end gap-x-1 gap-y-1.5", wide ? "grid-cols-[28px_auto_minmax(0,1fr)_28px_28px]" : "grid-cols-[28px_minmax(0,1fr)_auto_28px_28px]")}>
            <button
              type="button"
              aria-label="Add attachments and sources"
              aria-expanded={plusOpen}
              onClick={() => {
                setModelOpen(false)
                setPlusOpen((current) => !current)
                inputRef.current?.focus()
              }}
              className={cn(
                "flex size-7 shrink-0 items-center justify-center justify-self-start text-foreground/75 transition-[background-color,color,transform] duration-150 hover:bg-muted hover:text-foreground active:scale-[0.94]",
                pill ? "rounded-full" : "rounded-md",
                plusOpen && "bg-muted text-foreground",
                wide ? "col-start-1 row-start-2" : "col-start-1 row-start-1"
              )}
            >
              <Plus className="size-4" strokeWidth={2} />
            </button>

            <textarea
              ref={inputRef}
              rows={1}
              value={draft}
              onChange={(event) => {
                setDraft(event.target.value)
                setDismissed(false)
                setPlusOpen(false)
              }}
              onKeyDown={(event) => {
                if (menu && rows.length > 0) {
                  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                    event.preventDefault()
                    setEngaged(true)
                    setActive((current) => (current + (event.key === "ArrowDown" ? 1 : rows.length - 1)) % rows.length)
                    return
                  }
                  if ((event.key === "Enter" && !event.shiftKey) || event.key === "Tab") {
                    event.preventDefault()
                    pick(rows[active])
                    return
                  }
                }
                if (event.key === "Escape") {
                  setDismissed(true)
                  closeMenus()
                  return
                }
                if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                  event.preventDefault()
                  send()
                }
              }}
              placeholder={listening ? "Listening…" : (placeholder ?? "Write a message…")}
              aria-label="Prompt"
              className={cn(
                "w-full min-w-0 resize-none bg-transparent text-foreground outline-none [overflow-wrap:anywhere] placeholder:text-foreground/75",
                tall ? "min-h-[68px] px-2 py-2 text-[14px] leading-5" : "min-h-7 px-1 py-[5px] text-[13px] leading-[18px]",
                wide ? "col-span-full col-start-1 row-start-1" : "col-start-2 row-start-1"
              )}
            />

            <button
              ref={modelRef}
              type="button"
              aria-expanded={modelOpen}
              aria-label="Choose model"
              onClick={() => {
                setPlusOpen(false)
                setModelOpen((current) => !current)
              }}
              className={cn(
                "flex h-7 shrink-0 items-center gap-1 px-1.5 text-[12px] font-medium text-foreground/75 transition-colors duration-150 hover:bg-muted hover:text-foreground",
                pill ? "rounded-full" : "rounded-md",
                wide ? "col-start-2 row-start-2 justify-self-start" : "col-start-3 row-start-1"
              )}
            >
              {model.name}
              <ChevronDown className="size-2.5 text-foreground/75" strokeWidth={2.4} />
            </button>

            <button
              type="button"
              aria-label={listening ? "Stop dictation" : "Start dictation"}
              aria-pressed={listening}
              onClick={() => setListening((current) => !current)}
              className={cn(
                "flex size-7 shrink-0 items-center justify-center transition-[background-color,color,transform] duration-150 active:scale-[0.94]",
                pill ? "rounded-full" : "rounded-md",
                listening ? "bg-primary/14 text-primary" : "text-foreground/75 hover:bg-muted hover:text-foreground",
                wide ? "col-start-4 row-start-2" : "col-start-4 row-start-1"
              )}
            >
              {listening ? (
                <span className="flex h-3.5 items-center gap-[2.5px]">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="w-[2.5px] rounded-full bg-current" style={{ animation: `eq-bounce 900ms ease-in-out ${i * 150}ms infinite`, height: "100%" }} />
                  ))}
                </span>
              ) : (
                <Mic className="size-3.5" strokeWidth={2} />
              )}
            </button>

            <button
              type="button"
              aria-label="Send"
              disabled={!canSend}
              onClick={send}
              className={cn(
                "flex size-7 shrink-0 items-center justify-center transition-[background-color,color,transform] duration-200 enabled:active:scale-[0.94]",
                pill ? "rounded-full" : "rounded-md",
                canSend ? "bg-foreground text-background" : "bg-border text-foreground/75",
                wide ? "col-start-5 row-start-2" : "col-start-5 row-start-1"
              )}
            >
              <ArrowUp className="size-4" strokeWidth={2.4} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
