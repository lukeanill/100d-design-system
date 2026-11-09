"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowUp, Clock, Ellipsis, Plus } from "lucide-react"

import { IconButton } from "@workspace/ui/components/animate-ui/components/buttons/icon"
import { Button } from "@workspace/ui/components/button"
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
      className="flex w-full flex-col gap-1.5 transition-[opacity,filter,transform] duration-(--motion-duration)"
      style={{
        animation: "fade-up 400ms cubic-bezier(0.23,1,0.32,1) both",
        filter: resolving ? "blur(0.5px)" : "blur(0)",
        opacity: resolving ? 0.55 : 1,
        transform: resolving ? "scale(0.985)" : "scale(1)",
        transformOrigin: "top left",
        transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
      }}
    >
      <div className="flex items-center gap-1 text-xs leading-[1.3]">
        <span className="font-[weight:var(--font-body-weight-action)] text-foreground">{label}</span>
        <span className="text-foreground/75">{sub}</span>
        <span className="text-foreground">for {time}</span>
      </div>
      <p className="text-sm leading-normal text-foreground">{body}</p>
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
            <Button
              key={item}
              type="button"
              variant="ghost"
              size="xs"
              aria-pressed={tab === item}
              onClick={() => setTab(item)}
              className={cn("px-2", tab === item ? "bg-muted" : "opacity-50")}
            >
              {item}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          {[Plus, Clock, Ellipsis].map((Icon, i) => (
            <IconButton key={i} type="button" aria-label="Action" variant="ghost" size="xs">
              <Icon strokeWidth={2} />
            </IconButton>
          ))}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto px-3 pt-2.5 pb-1">
        <div className="flex justify-end pl-14">
          <div
            className="rounded-xl bg-muted px-3 py-1.5 text-sm leading-[1.4] text-foreground transition-[opacity,transform] duration-(--motion-duration)"
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
          className="flex cursor-text flex-col gap-2 rounded-md border border-border bg-muted p-2.5 shadow-xs transition-[border-color,box-shadow] duration-(--motion-fast) focus-within:border-foreground/20"
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
            className="min-h-4.5 bg-transparent text-sm leading-[1.4] text-foreground outline-none placeholder:text-foreground/75"
          />
          <div className="flex items-center justify-end">
            <IconButton type="button" aria-label="Send" disabled={!canSend} onClick={send} size="xs">
              <ArrowUp strokeWidth={2.4} />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  )
}
