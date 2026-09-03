"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowUp, Clock, Ellipsis, Plus } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"

/* Tabbed chat panel with reasoning replies and a composer. The reply
 * sequence begins only after the user sends. Ported from beautifui.dev. */

type Phase = "idle" | "sent" | "reply1" | "reply2" | "done"

export type ChatMessage = {
  label: string
  sub: string
  time: string
  body: string
}

const MESSAGES: ChatMessage[] = [
  { body: "Pulled 3 summers of mint chip sales for comparison.", label: "Sales History", sub: "Flavor Data", time: "4s" },
  { body: "Mint chip is up 12% with stronger weekend peaks.", label: "Comparison", sub: "Trend Detection", time: "2s" },
]

const SUGGESTIONS = ["Flavors", "Suppliers"]

export type ChatComposerLabels = {
  initialPrompt: string
  placeholder: string
}

const DEFAULT_LABELS: ChatComposerLabels = {
  initialPrompt: "Compare mint chip to last summer",
  placeholder: "Prompt or tag a flavor with @",
}

function Section({ label, sub, time, body, resolving }: { label: string; sub: string; time: string; body: string; resolving?: boolean }) {
  return (
    <div
      className="flex w-full flex-col gap-1.5 transition-[opacity,filter,transform] duration-400"
      style={{
        animation: "fade-up 400ms cubic-bezier(0.23,1,0.32,1) both",
        filter: resolving ? "blur(0.5px)" : "blur(0)",
        opacity: resolving ? 0.55 : 1,
        transform: resolving ? "scale(0.985)" : "scale(1)",
        transformOrigin: "top left",
        transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
      }}
    >
      <div className="flex items-center gap-1 text-[12px] leading-[1.3]">
        <span className="font-medium text-foreground">{label}</span>
        <span className="text-secondary-foreground">{sub}</span>
        <span className="text-foreground">for {time}</span>
      </div>
      <p className="text-[13px] leading-normal text-foreground">{body}</p>
    </div>
  )
}

export interface ChatComposerProps {
  data?: {
    messages?: ChatMessage[]
    suggestions?: string[]
  }
  labels?: Partial<ChatComposerLabels>
  actions?: {
    onSend?: (text: string) => void
  }
  className?: string
}

export const ChatComposer = ({ data, labels, actions, className }: ChatComposerProps = {}) => {
  const messages = data?.messages ?? MESSAGES
  const suggestions = data?.suggestions ?? SUGGESTIONS
  const l = { ...DEFAULT_LABELS, ...labels }
  const [phase, setPhase] = useState<Phase>("done")
  const [draft, setDraft] = useState("")
  const [submitted, setSubmitted] = useState(l.initialPrompt)
  const [tab, setTab] = useState(suggestions[0] ?? "")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>
    if (phase === "sent") t = setTimeout(() => setPhase("reply1"), 500)
    else if (phase === "reply1") t = setTimeout(() => setPhase("reply2"), 1400)
    else if (phase === "reply2") t = setTimeout(() => setPhase("done"), 1200)
    else return
    return () => clearTimeout(t)
  }, [phase])

  const sent = phase !== "idle"
  const canSend = draft.trim().length > 0

  const send = () => {
    if (!canSend) return
    const text = draft.trim()
    setSubmitted(text)
    actions?.onSend?.(text)
    setDraft("")
    setPhase("sent")
  }

  return (
    <div className={cn("flex h-[288px] w-full max-w-95 flex-col self-start overflow-hidden rounded-lg bg-card ring-1 ring-foreground/10", className)}>
      <div className="flex shrink-0 items-center justify-between border-b border-border p-1.5">
        <div className="flex items-center">
          {suggestions.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={tab === item}
              onClick={() => setTab(item)}
              className={cn("rounded-md px-2 py-[3px] text-[13px] text-foreground transition-[background-color,opacity] duration-100", tab === item ? "bg-muted" : "opacity-50 hover:opacity-75")}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          {[Plus, Clock, Ellipsis].map((Icon, i) => (
            <button key={i} type="button" aria-label="Action" className="flex size-6 items-center justify-center rounded-md text-secondary-foreground transition-colors duration-100 hover:bg-muted hover:text-foreground">
              <Icon className="size-3.5" strokeWidth={2} />
            </button>
          ))}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto px-3 pt-2.5 pb-1">
        <div className="flex justify-end pl-14">
          <div
            className="rounded-xl bg-muted px-3 py-1.5 text-[13px] leading-[1.4] text-foreground transition-[opacity,transform] duration-300"
            style={{ opacity: sent ? 1 : 0, transform: sent ? "translateY(0)" : "translateY(10px)", transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
          >
            {submitted}
          </div>
        </div>

        {messages[0] && (phase === "reply1" || phase === "reply2" || phase === "done") ? (
          <Section label={messages[0].label} sub={messages[0].sub} time={messages[0].time} body={messages[0].body} />
        ) : null}
        {messages[1] && (phase === "reply2" || phase === "done") ? (
          <Section label={messages[1].label} sub={messages[1].sub} time={messages[1].time} body={messages[1].body} resolving={phase === "reply2"} />
        ) : null}
      </div>

      <div className="mt-auto shrink-0 p-1.5">
        <div
          role="presentation"
          onClick={() => inputRef.current?.focus()}
          className="flex cursor-text flex-col gap-2 rounded-md border border-border bg-muted p-2.5 shadow-xs transition-[border-color,box-shadow] duration-150 focus-within:border-foreground/20"
        >
          <input
            ref={inputRef}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") send()
            }}
            placeholder={l.placeholder}
            aria-label="Chat prompt"
            className="min-h-4.5 bg-transparent text-[13px] leading-[1.4] text-foreground outline-none placeholder:text-secondary-foreground"
          />
          <div className="flex items-center justify-end">
            <button
              type="button"
              aria-label="Send"
              disabled={!canSend}
              onClick={send}
              className={cn(
                "flex size-7 items-center justify-center rounded-md transition-[background-color,color,transform] duration-200 enabled:active:scale-[0.96]",
                canSend ? "bg-foreground text-background" : "bg-border text-secondary-foreground"
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
