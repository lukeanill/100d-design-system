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
      <div className="flex items-center gap-2 px-0.5" style={{ animation: "fade-in 400ms ease-out both" }}>
        <span className="text-[13px] font-semibold text-foreground">{copy.header}</span>
        <span className="inline-flex h-5 items-center rounded-md bg-muted px-1.5 text-[11.5px] font-medium text-foreground/75 ring-1 ring-foreground/10 tabular-nums">{copy.count}</span>
      </div>

      {chunks.map((chunk, i) => (
        <div key={chunk.title} className="overflow-hidden rounded-lg bg-card ring-1 ring-foreground/10" style={{ animation: `fade-up 400ms cubic-bezier(0.23,1,0.32,1) ${i * 100}ms both` }}>
          <div className="flex items-center gap-2.5 border-b border-border p-2.5">
            <span className="flex min-w-0 items-center gap-1.5 text-[13px] font-medium text-foreground">
              <List className="size-3" strokeWidth={2.5} />
              <span className="truncate">{chunk.title}</span>
            </span>
            <span className="ml-auto shrink-0 text-[12px] text-foreground/75 tabular-nums">{chunk.chars}</span>
          </div>
          <p className="px-3 pt-2 pb-1 text-[12.5px] leading-relaxed text-foreground/75">{chunk.body}</p>
          <div className="px-3 pb-3">
            <span
              className="inline-flex h-6 items-center gap-1.5 rounded-full bg-muted px-2 text-[12px] font-medium text-foreground/75 shadow-xs transition-[opacity,transform,background-color] duration-300 hover:bg-muted/70"
              style={{
                opacity: chipsShown ? 1 : 0,
                transform: chipsShown ? "scale(1)" : "scale(0.95)",
                transitionDelay: `${i * 80}ms`,
                transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
              }}
            >
              <span className={cn("flex size-3.5 items-center justify-center rounded-[4px] text-[7px] font-bold text-white", chunk.tone === "destructive" ? "bg-destructive" : "bg-affirmative")}>
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
