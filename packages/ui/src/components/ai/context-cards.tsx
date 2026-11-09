"use client"

import { useEffect, useState } from "react"
import { ExternalLink, List } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"

/* Retrieved knowledge chunks with their sources — enters once, then stays
 * available. Ported from beautifui.dev. */

export type ContextChunk = {
  title: string
  chars: string
  body: string
  source: string
  badge: string
  tone: "affirmative" | "destructive"
}

export type ContextCardsLabels = {
  header: string
  count: string
}

const DEFAULT_LABELS: ContextCardsLabels = {
  count: "32",
  header: "All chunks",
}

const CHUNKS: ContextChunk[] = [
  {
    badge: "PDF",
    body: "Cold-chain certification must be verified before a new dairy can be added to the reorder workflow.",
    chars: "290 characters",
    source: "Dairy Onboarding SOP.pdf",
    title: "Vendor onboarding rule",
    tone: "destructive",
  },
  {
    badge: "CSV",
    body: "Q4 velocity table: pistachio +18%, vanilla +6%, rocky road -11%; retire flavors below 40 scoops weekly.",
    chars: "1,250 characters",
    source: "Sales Velocity Export.csv",
    title: "Seasonal demand row",
    tone: "affirmative",
  },
]

export interface ContextCardsProps {
  data?: {
    chunks?: ContextChunk[]
  }
  labels?: Partial<ContextCardsLabels>
  className?: string
}

export const ContextCards = ({ data, labels, className }: ContextCardsProps = {}) => {
  const chunks = data?.chunks ?? CHUNKS
  const [chipsShown, setChipsShown] = useState(false)
  const copy = { ...DEFAULT_LABELS, ...labels }

  useEffect(() => {
    const chips = setTimeout(() => setChipsShown(true), 700)
    return () => clearTimeout(chips)
  }, [])

  return (
    <div className={cn("flex w-full max-w-95 flex-col gap-2", className)}>
      <div className="flex items-center gap-2 px-0.5" style={{ animation: "fade-in var(--motion-duration) var(--motion-transition-ease) both" }}>
        <span className="text-sm font-[weight:var(--font-body-weight-emphasis)] text-foreground">{copy.header}</span>
        <span className="inline-flex h-5 items-center rounded-md bg-muted px-1.5 text-xs font-[weight:var(--font-body-weight-action)] text-foreground/75 ring-1 ring-foreground/10 tabular-nums">{copy.count}</span>
      </div>

      {chunks.map((chunk, i) => (
        <div key={chunk.title} className="overflow-hidden rounded-lg bg-card ring-1 ring-foreground/10" style={{ animation: `fade-up var(--motion-duration) var(--motion-transition-ease) calc(var(--duration-fast) * ${i * 0.5}) both` }}>
          <div className="flex items-center gap-2.5 border-b border-border p-2.5">
            <span className="flex min-w-0 items-center gap-1.5 text-sm font-[weight:var(--font-body-weight-action)] text-foreground">
              <List className="size-3" strokeWidth={2.5} />
              <span className="truncate">{chunk.title}</span>
            </span>
            <span className="ml-auto shrink-0 text-xs text-foreground/75 tabular-nums">{chunk.chars}</span>
          </div>
          <p className="px-3 pt-2 pb-1 text-xs leading-relaxed text-foreground/75">{chunk.body}</p>
          <div className="px-3 pb-3">
            <span
              className="inline-flex h-6 items-center gap-1.5 rounded-full bg-muted px-2 text-xs font-[weight:var(--font-body-weight-action)] text-foreground/75 shadow-xs transition-[opacity,transform,background-color] duration-(--motion-duration) hover:bg-muted/70"
              style={{
                opacity: chipsShown ? 1 : 0,
                transform: chipsShown ? "scale(1)" : "scale(0.95)",
                transitionDelay: `calc(var(--duration-fast) * ${i * 0.4})`,
                transitionTimingFunction: "var(--motion-transition-ease)",
              }}
            >
              <span className={cn("flex size-4 items-center justify-center rounded-xs text-xs font-[weight:var(--font-body-weight-emphasis)] text-primary-foreground", chunk.tone === "destructive" ? "bg-destructive" : "bg-affirmative")}>
                {chunk.badge}
              </span>
              {chunk.source}
              <ExternalLink className="size-2.5" strokeWidth={2.5} />
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
