"use client"

import { useEffect, useState } from "react"
import { ArrowDown, ArrowUp, Copy, CornerDownRight, RefreshCw } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"

/* Streamed answer: words resolve in, an inline citation appears in context,
 * then actions and follow-up prompts become usable. Ported from beautifui.dev. */

export type StreamingToken = { text: string; cite?: boolean }

const WORD_MS = 55
const HOLD_MS = 3400

const TOKENS: StreamingToken[] = [
  ..."Pistachio is your fastest-growing flavor — sales are up 23% this month and margins beat vanilla by 8 points."
    .split(" ")
    .map((text) => ({ text })),
  { cite: true, text: "" },
  ..."Stone-fruit flavors are trending in the same range.".split(" ").map((text) => ({ text })),
]

const FOLLOW_UPS = ["Which flavors sell best in winter", "Compare gelato and soft serve margins"]

export type StreamingSource = { name: string; domain: string; href: string }

const SOURCES: StreamingSource[] = [
  { domain: "scoopdata.io", href: "https://scoopdata.io/", name: "Scoop Data" },
  { domain: "trends.google.com", href: "https://trends.google.com/trends/", name: "Trends Index" },
  { domain: "marketbasket.io", href: "https://marketbasket.io/", name: "Market Basket" },
]

function SourceChip({ source }: { source?: StreamingSource }) {
  if (!source) return null
  return (
    <a
      href={source.href}
      target="_blank"
      rel="noreferrer"
      className="mr-1 ml-0 inline-flex h-4.5 translate-y-[-1px] items-center gap-1 rounded-[5px] bg-muted pr-[3px] pl-[3px] align-middle font-mono text-[10.5px] text-secondary-foreground ring-1 ring-foreground/10 transition-colors duration-150 hover:bg-muted/70 hover:text-foreground"
      style={{ animation: "pop-in 250ms cubic-bezier(0.23,1,0.32,1) both" }}
    >
      <span className="size-3 rounded-[3px] bg-primary" />
      <span>{source.domain}</span>
    </a>
  )
}

const ACTION_ICONS = [Copy, RefreshCw, ArrowUp, ArrowDown]

export type StreamingLabels = {
  sources: string
  followUps: string
}

const DEFAULT_LABELS: StreamingLabels = {
  followUps: "Follow-ups",
  sources: "10 sources",
}

export interface StreamingTextProps {
  appearance?: {
    fill?: boolean
    loop?: boolean
  }
  data?: {
    content?: StreamingToken[]
    followUps?: string[]
    sources?: StreamingSource[]
  }
  labels?: Partial<StreamingLabels>
  actions?: {
    onDone?: () => void
    onFollowUp?: (text: string, index: number) => void
  }
  className?: string
}

export const StreamingText = ({ appearance, data, labels, actions, className }: StreamingTextProps = {}) => {
  const content = data?.content ?? TOKENS
  const sources = data?.sources ?? SOURCES
  const followUps = data?.followUps ?? FOLLOW_UPS
  const loop = appearance?.loop ?? true
  const fill = appearance?.fill ?? false
  const l = { ...DEFAULT_LABELS, ...labels }

  const [count, setCount] = useState(0)
  const [sourcesOpen, setSourcesOpen] = useState(false)
  const done = count >= content.length

  useEffect(() => {
    if (done && !loop) {
      actions?.onDone?.()
      return
    }
    const t = setTimeout(() => setCount((c) => (c >= content.length ? 0 : c + 1)), done ? HOLD_MS : WORD_MS)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, done, loop])

  return (
    <div className={cn(fill ? "w-full" : "min-h-[15.5rem] w-full max-w-95", className)}>
      <p className="text-[13px] leading-relaxed text-foreground">
        {content.slice(0, count).map((token, i) =>
          token.cite ? (
            <SourceChip key={i} source={sources[0]} />
          ) : (
            <span key={i} className="inline">
              {token.text}{" "}
            </span>
          )
        )}
        {!done && (
          <span className="ml-0.5 inline-block h-3 w-0.5 translate-y-0.5 rounded-full bg-foreground" style={{ animation: "fade-in 150ms ease-out both" }} />
        )}
      </p>

      <div className="mt-2 flex items-center gap-0.5 transition-opacity duration-400" style={{ opacity: done ? 1 : 0, pointerEvents: done ? "auto" : "none" }}>
        {ACTION_ICONS.map((Icon, i) => (
          <button
            key={i}
            type="button"
            aria-label="Action"
            className="flex size-6 items-center justify-center rounded-md text-secondary-foreground transition-colors duration-100 hover:bg-muted hover:text-foreground"
          >
            <Icon className="size-3.5" strokeWidth={1.8} />
          </button>
        ))}
        <button
          type="button"
          aria-expanded={sourcesOpen}
          onClick={() => setSourcesOpen((current) => !current)}
          className="ml-1.5 flex items-center gap-1.5 rounded-md px-1 py-0.5 text-left transition-colors duration-150 hover:bg-muted"
        >
          <span className="flex -space-x-1">
            {sources.map((source) => (
              <span key={source.domain} className="size-3.5 rounded-full bg-primary ring-2 ring-background" />
            ))}
          </span>
          <span className="text-[12px] text-secondary-foreground">{l.sources}</span>
        </button>
      </div>

      <div
        className="grid transition-[grid-template-rows,opacity] duration-300"
        style={{
          gridTemplateRows: done && sourcesOpen ? "1fr" : "0fr",
          opacity: done && sourcesOpen ? 1 : 0,
          transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      >
        <div className="overflow-hidden">
          <div className="mt-1.5 flex flex-col rounded-lg bg-muted p-1 ring-1 ring-foreground/10">
            {sources.map((source) => (
              <a
                key={source.domain}
                href={source.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-md px-1.5 py-1 text-[12px] text-secondary-foreground transition-colors duration-150 hover:bg-muted/70 hover:text-foreground"
              >
                <span className="size-4 rounded-[4px] bg-primary" />
                <span className="animated-underline">{source.name}</span>
                <span className="ml-auto font-mono text-[10.5px] text-secondary-foreground">{source.domain}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-2.5 transition-opacity duration-400" style={{ opacity: done ? 1 : 0, pointerEvents: done ? "auto" : "none" }}>
        <p className="text-[12px] font-medium text-secondary-foreground">{l.followUps}</p>
        <div className="mt-0.5 flex flex-col">
          {followUps.map((text, i) => (
            <button
              key={text}
              onClick={() => actions?.onFollowUp?.(text, i)}
              className="-mx-1.5 flex items-center gap-2 rounded-md border-b border-border px-1.5 py-1.5 text-left text-[12.5px] text-foreground transition-colors duration-100 hover:bg-muted"
              style={done ? { animation: `fade-up 350ms cubic-bezier(0.23,1,0.32,1) ${i * 90}ms both` } : { opacity: 0 }}
            >
              <CornerDownRight className="size-2.5 shrink-0 text-secondary-foreground" strokeWidth={2} />
              {text}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
