"use client"

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import type { ReactNode } from "react"
import { ArrowUp, Check, ChevronRight, MessageCircleQuestion, RotateCw, Scissors, SpellCheck, Sparkles, Smile, X } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

/* A contextual AI bar attached beneath selected text — highlight a passage
 * and hand it to the agent to rewrite. Ported from beautifui.dev. */

const LEAD = "Pistachio holds the top slot all weekend. "
const PICKED = "Churn it first thing Saturday so the batch has time to firm up before the afternoon rush."
const REWRITE = "Churn pistachio first thing Saturday so the batch has time to fully firm before the afternoon rush."

export type SelectionText = {
  lead: string
  original: string
  rewrite: string
}

export type SelectionAction = {
  id: string
  icon: ReactNode
  action?: string
  busyLabel?: string
}

export type SelectionActionSet = {
  primary: SelectionAction[]
  more: SelectionAction[]
}

export type SelectionActionsLabels = {
  keep: string
  discard: string
  placeholder: string
}

const DEFAULT_TEXT: SelectionText = { lead: LEAD, original: PICKED, rewrite: REWRITE }
const DEFAULT_LABELS: SelectionActionsLabels = { discard: "Discard", keep: "Keep", placeholder: "Describe edits" }

type Mode = "idle" | "thinking" | "streaming" | "result"

const iconProps = { className: "size-3.5", strokeWidth: 1.8 }

const icons = {
  chevron: <ChevronRight {...iconProps} />,
  close: <X {...iconProps} />,
  explain: <MessageCircleQuestion {...iconProps} />,
  grammar: <SpellCheck {...iconProps} />,
  improve: <Sparkles {...iconProps} />,
  keep: <Check {...iconProps} />,
  retry: <RotateCw {...iconProps} />,
  send: <ArrowUp className="size-4" strokeWidth={2.4} />,
  shorten: <Scissors {...iconProps} />,
  tone: <Smile {...iconProps} />,
}

const DEFAULT_ACTIONS: SelectionActionSet = {
  more: [
    { action: "Shorten", busyLabel: "Shortening", icon: icons.shorten, id: "Shorten" },
    { action: "Change tone", busyLabel: "Changing tone", icon: icons.tone, id: "Tone" },
    { action: "Fix grammar", icon: icons.grammar, id: "Grammar" },
  ],
  primary: [
    { icon: icons.explain, id: "Explain" },
    { action: "Improve", busyLabel: "Improving", icon: icons.improve, id: "Improve" },
  ],
}

function Shimmer({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn("inline-block bg-clip-text text-transparent", className)}
      style={{
        animation: "shimmer-text 1.8s linear infinite",
        backgroundImage: "linear-gradient(90deg, var(--secondary-foreground) 35%, var(--foreground) 50%, var(--secondary-foreground) 65%)",
        backgroundSize: "200% 100%",
      }}
    >
      {children}
    </span>
  )
}

function StreamText({ text, onProgress, onDone }: { text: string; onProgress?: () => void; onDone?: () => void }) {
  const [count, setCount] = useState(0)
  const onProgressRef = useRef(onProgress)
  const onDoneRef = useRef(onDone)
  onProgressRef.current = onProgress
  onDoneRef.current = onDone

  useEffect(() => {
    setCount(0)
    let i = 0
    const id = setInterval(() => {
      i = Math.min(i + 2, text.length)
      setCount(i)
      onProgressRef.current?.()
      if (i >= text.length) {
        clearInterval(id)
        onDoneRef.current?.()
      }
    }, 9)
    return () => clearInterval(id)
  }, [text])

  const streaming = count < text.length
  const shown = text.slice(0, count)
  const split = streaming ? Math.max(0, shown.length - 6) : shown.length

  return (
    <span>
      {shown.slice(0, split)}
      {split < shown.length && <span className="ai-stream-tail">{shown.slice(split)}</span>}
      <span aria-hidden className={cn("ai-stream-caret", streaming && "is-streaming")} />
    </span>
  )
}

export interface SelectionActionsProps {
  data?: {
    text?: Partial<SelectionText>
    actions?: SelectionActionSet
  }
  labels?: Partial<SelectionActionsLabels>
  actions?: {
    onAction?: (action: string) => void
  }
}

export const SelectionActions = ({ data, labels, actions: callbacks }: SelectionActionsProps = {}) => {
  const passage = { ...DEFAULT_TEXT, ...data?.text }
  const actionSet = data?.actions ?? DEFAULT_ACTIONS
  const copy = { ...DEFAULT_LABELS, ...labels }
  const [shown, setShown] = useState(false)
  const [mode, setMode] = useState<Mode>("idle")
  const [action, setAction] = useState("Improve")
  const [prompt, setPrompt] = useState("")
  const [typingWidth, setTypingWidth] = useState<number | null>(null)
  const [expanded, setExpanded] = useState(false)
  const [anchor, setAnchor] = useState({ x: 0, y: 0 })
  const [positioned, setPositioned] = useState(false)

  const hostRef = useRef<HTMLDivElement>(null)
  const selectionRef = useRef<HTMLSpanElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number | null>(null)
  const previousModeRef = useRef<Mode>("idle")
  const lastWidthRef = useRef(0)
  const widthAnimationRef = useRef<Animation | null>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setShown(true), 280)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (mode !== "thinking") return
    const timer = window.setTimeout(() => setMode("streaming"), 700)
    return () => window.clearTimeout(timer)
  }, [mode])

  const place = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(() => {
      const host = hostRef.current
      const selection = selectionRef.current
      if (!host || !selection) return

      const bounds = selection.getBoundingClientRect()
      const lines = Array.from(selection.getClientRects())
      const lastLine = lines.at(-1)
      if (!lastLine) return

      const hostBounds = host.getBoundingClientRect()
      const next = { x: Math.round(bounds.left - hostBounds.left + bounds.width / 2), y: Math.round(lastLine.bottom - hostBounds.top + 8) }

      setAnchor((current) => (current.x === next.x && current.y === next.y ? current : next))
      setPositioned(true)
    })
  }, [])

  useLayoutEffect(() => {
    place()
  }, [mode, place])

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const observer = new ResizeObserver(place)
    observer.observe(host)
    window.addEventListener("resize", place)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", place)
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    }
  }, [place])

  useLayoutEffect(() => {
    const bar = barRef.current
    const content = contentRef.current
    if (!bar || !content) return

    const nextWidth = Math.ceil(content.getBoundingClientRect().width) + 8
    const previousWidth = lastWidthRef.current || Math.ceil(bar.getBoundingClientRect().width)

    if (previousModeRef.current !== mode && Math.abs(nextWidth - previousWidth) > 1) {
      widthAnimationRef.current?.cancel()
      const animation = bar.animate([{ width: `${previousWidth}px` }, { width: `${nextWidth}px` }], { duration: 320, easing: "cubic-bezier(0.23,1,0.32,1)" })
      widthAnimationRef.current = animation
      animation.onfinish = () => {
        lastWidthRef.current = nextWidth
        widthAnimationRef.current = null
      }
    } else {
      lastWidthRef.current = nextWidth
    }

    previousModeRef.current = mode
  }, [mode])

  useEffect(() => {
    const content = contentRef.current
    if (!content) return

    const observer = new ResizeObserver(() => {
      if (widthAnimationRef.current?.playState === "running") return
      lastWidthRef.current = Math.ceil(content.getBoundingClientRect().width) + 8
    })
    observer.observe(content)
    return () => {
      observer.disconnect()
      widthAnimationRef.current?.cancel()
    }
  }, [])

  const run = (nextAction: string) => {
    setAction(nextAction)
    setExpanded(false)
    setMode("thinking")
    callbacks?.onAction?.(nextAction)
  }

  const reset = () => {
    setExpanded(false)
    setPrompt("")
    setTypingWidth(null)
    setAction("Improve")
    setMode("idle")
  }

  const busy = mode === "thinking" || mode === "streaming"
  const visible = shown && positioned
  const hasPrompt = prompt.trim().length > 0
  const busyLabelMap: Record<string, string> = {}
  for (const item of [...actionSet.primary, ...actionSet.more]) {
    if (item.action && item.busyLabel) busyLabelMap[item.action] = item.busyLabel
  }
  const busyLabel = busyLabelMap[action] ?? "Editing"

  return (
    <div className="w-full max-w-[460px]">
      <div ref={hostRef} className="relative pb-12 select-none">
        <p className="text-[13px] leading-relaxed text-foreground">
          {passage.lead}
          <span ref={selectionRef} className="rounded-[3px] bg-primary/14 text-foreground box-decoration-clone">
            {mode === "idle" || mode === "thinking" ? passage.original : mode === "streaming" ? <StreamText text={passage.rewrite} onProgress={place} onDone={() => setMode("result")} /> : passage.rewrite}
          </span>
        </p>

        <div
          className="absolute top-0 left-0 z-10"
          style={{
            opacity: visible ? 1 : 0,
            pointerEvents: visible ? "auto" : "none",
            transform: `translate3d(${anchor.x}px, ${anchor.y}px, 0) translateX(-50%)`,
            transition: "transform 320ms cubic-bezier(0.77,0,0.175,1), opacity 180ms ease-out",
            willChange: "transform",
          }}
        >
          <div
            ref={barRef}
            className="flex h-9 w-fit max-w-[calc(100vw-48px)] items-center justify-center gap-0.5 overflow-hidden rounded-full bg-card p-1 font-sans font-normal text-foreground shadow-lg ring-1 ring-foreground/10"
            style={{
              width: mode === "idle" && hasPrompt && typingWidth ? typingWidth : undefined,
              ...(visible ? { animation: "pop-in 220ms cubic-bezier(0.23,1,0.32,1) both" } : {}),
            }}
          >
            <div ref={contentRef} className="flex w-fit shrink-0 items-center justify-center gap-0.5" style={{ width: mode === "idle" && hasPrompt && typingWidth ? typingWidth - 8 : undefined }}>
              {busy && (
                <span className="inline-flex h-7 items-center gap-1.5 px-2.5 text-[12.5px] font-normal whitespace-nowrap text-foreground/75">
                  <span className="size-3 shrink-0 rounded-full border-[1.5px] border-border border-t-secondary-foreground" style={{ animation: "spin 700ms linear infinite" }} />
                  {mode === "thinking" ? <Shimmer className="text-[12.5px] font-normal">{busyLabel}…</Shimmer> : <span>{busyLabel}…</span>}
                </span>
              )}

              {mode === "result" && (
                <>
                  <button
                    type="button"
                    onClick={reset}
                    className="inline-flex h-7 shrink-0 items-center gap-1 rounded-full bg-foreground px-2.5 text-[12.5px] font-normal text-background shadow-xs transition-[opacity,transform] duration-150 hover:opacity-90 active:scale-[0.96]"
                  >
                    {icons.keep}
                    {copy.keep}
                  </button>
                  <Button type="button" variant="ghost" size="xs" className="shrink-0" onClick={reset}>
                    {icons.close}
                    {copy.discard}
                  </Button>
                  <span className="mx-0.5 h-4 w-px shrink-0 bg-border" />
                  <button
                    type="button"
                    aria-label="Try again"
                    onClick={() => run(action)}
                    className="flex size-7 shrink-0 items-center justify-center rounded-full text-foreground/75 transition-[background-color,color,transform] duration-150 hover:bg-muted hover:text-foreground active:scale-[0.96]"
                  >
                    {icons.retry}
                  </button>
                </>
              )}

              {mode === "idle" && (
                <>
                  <div
                    className="flex min-w-0 items-center overflow-hidden transition-[max-width,opacity,transform] duration-400"
                    style={{
                      maxWidth: expanded ? 0 : hasPrompt && typingWidth ? typingWidth - 40 : 145,
                      opacity: expanded ? 0 : 1,
                      transform: expanded ? "translateX(-8px)" : "translateX(0)",
                      transitionTimingFunction: "cubic-bezier(0.23,1,0.32,1)",
                    }}
                  >
                    <form
                      className="flex h-7 shrink-0 items-center transition-[width] duration-400"
                      style={{ transitionTimingFunction: "cubic-bezier(0.23,1,0.32,1)", width: hasPrompt && typingWidth ? typingWidth - 40 : 145 }}
                      onSubmit={(event) => {
                        event.preventDefault()
                        run(prompt.trim() || "Improve")
                      }}
                    >
                      <input
                        value={prompt}
                        onChange={(event) => {
                          const next = event.target.value
                          if (!prompt.trim() && next.trim()) {
                            setTypingWidth(Math.ceil(barRef.current?.getBoundingClientRect().width ?? 0))
                          } else if (!next.trim()) {
                            setTypingWidth(null)
                          }
                          setPrompt(next)
                        }}
                        aria-label={copy.placeholder}
                        placeholder={copy.placeholder}
                        className="h-7 w-full bg-transparent pr-2.5 pl-3 text-[12.5px] text-foreground placeholder:text-foreground/75"
                      />
                    </form>
                  </div>

                  <div
                    className="flex min-w-0 items-center gap-0.5 overflow-hidden transition-[max-width,opacity,transform] duration-400"
                    style={{
                      maxWidth: hasPrompt ? 0 : expanded ? 462 : 224,
                      opacity: hasPrompt ? 0 : 1,
                      transform: hasPrompt ? "translateX(-8px)" : "translateX(0)",
                      transitionTimingFunction: "cubic-bezier(0.23,1,0.32,1)",
                    }}
                  >
                    {!expanded && <span className="mx-1 h-4 w-px shrink-0 bg-border" />}
                    {actionSet.primary.map((item) => (
                      <Button key={item.id} type="button" variant="ghost" size="xs" className="shrink-0" onClick={item.action ? () => run(item.action!) : undefined}>
                        {item.icon}
                        {item.id}
                      </Button>
                    ))}

                    <div
                      className="flex min-w-0 items-center gap-0.5 overflow-hidden transition-[max-width,opacity,margin] duration-400"
                      style={{ marginLeft: expanded ? 2 : 0, maxWidth: expanded ? 262 : 0, opacity: expanded ? 1 : 0, transitionTimingFunction: "cubic-bezier(0.23,1,0.32,1)" }}
                    >
                      {actionSet.more.map((item) => (
                        <Button key={item.id} type="button" variant="ghost" size="xs" className="shrink-0" onClick={item.action ? () => run(item.action!) : undefined}>
                          {item.icon}
                          {item.id}
                        </Button>
                      ))}
                    </div>

                    <span className="mx-0.5 h-4 w-px shrink-0 bg-border" />
                    <button
                      type="button"
                      aria-label={expanded ? "Show fewer actions" : "Show more actions"}
                      aria-expanded={expanded}
                      onClick={() => setExpanded((value) => !value)}
                      className="flex size-7 shrink-0 items-center justify-center rounded-full text-foreground transition-[background-color,transform] duration-200 hover:bg-muted active:scale-[0.96]"
                    >
                      <span className="flex transition-transform duration-400" style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transitionTimingFunction: "cubic-bezier(0.23,1,0.32,1)" }}>
                        {icons.chevron}
                      </span>
                    </button>
                  </div>

                  <div
                    className="flex min-w-0 items-center overflow-hidden transition-[max-width,opacity,transform] duration-400"
                    style={{ maxWidth: hasPrompt ? 30 : 0, opacity: hasPrompt ? 1 : 0, transform: hasPrompt ? "scale(1)" : "scale(0.88)", transitionTimingFunction: "cubic-bezier(0.23,1,0.32,1)" }}
                  >
                    <button
                      type="button"
                      aria-label="Send edit instruction"
                      onClick={() => run(prompt.trim())}
                      className="flex size-7 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-[opacity,transform] duration-200 active:scale-[0.94]"
                    >
                      {icons.send}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
