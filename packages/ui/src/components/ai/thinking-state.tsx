"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import type { ReactNode } from "react"
import { Check, ChevronDown, Search, Sparkle } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"

/* Expandable agent trace — Steps / Reasoning / Search / Coding. The trace
 * runs once, settles, and remains expandable. Ported from beautifui.dev. */

const STAGES = [800, 600, 1800, 2600, 1600]

function useSequence(steps: number[]) {
  const [stage, setStage] = useState(0)
  useEffect(() => {
    if (stage >= steps.length - 1) return
    const t = setTimeout(() => setStage((s) => s + 1), steps[stage])
    return () => clearTimeout(t)
  }, [stage, steps])
  return stage
}

type Row = {
  primary: string
  secondary?: string
  mono?: boolean
  add?: number
  del?: number
  href?: string
}

const VARIANTS: Record<string, { active: string; done: string; rows: Row[]; query?: string }> = {
  Coding: {
    active: "Running tools",
    done: "Ran 3 tools",
    rows: [
      { primary: "Read", secondary: "flavors.ts", mono: true },
      { primary: "Edit", secondary: "ChurnSchedule.tsx", mono: true, add: 74, del: 41 },
      { primary: "Run", secondary: "npm run freeze", mono: true },
    ],
  },
  Reasoning: {
    active: "Thinking",
    done: "Thought for 4 seconds",
    rows: [
      { primary: "Summer demand spikes for stone-fruit flavors — peach and apricot lead." },
      { primary: "I should check cone inventory before promoting a waffle-bowl special." },
    ],
  },
  Search: {
    active: "Searching the web",
    done: "Searched the web",
    query: "best waffle cone supplier",
    rows: [
      { primary: "Joy Cone", secondary: "joycone.com", href: "https://joycone.com/fs_products/waffle-cones/" },
      { primary: "WebstaurantStore", secondary: "webstaurantstore.com", href: "https://www.webstaurantstore.com/ice-cream-shop-supplies.html" },
      { primary: "The Konery", secondary: "thekonery.com", href: "https://www.thekonery.com/" },
    ],
  },
  Steps: {
    active: "Thinking",
    done: "Thought for 4 seconds",
    rows: [
      { primary: "Reading flavor briefs" },
      { primary: "Scanning supplier lists" },
      { primary: "Comparing tasting notes", secondary: "6 flavors" },
      { primary: "Writing the scoop report" },
    ],
  },
}

function Dot({ tone }: { tone: string }) {
  return (
    <span className={cn("flex size-3.5 shrink-0 items-center justify-center rounded-full text-white", tone)}>
      <Search className="size-2" strokeWidth={3} />
    </span>
  )
}

const TONES = ["bg-primary", "bg-amber-500", "bg-affirmative"]

export interface ThinkingStateProps {
  appearance?: {
    variant?: "Steps" | "Reasoning" | "Search" | "Coding"
  }
  onSettled?: () => void
  className?: string
}

export const ThinkingState = ({ appearance, onSettled, className }: ThinkingStateProps = {}) => {
  const variant = appearance?.variant ?? "Steps"
  const stage = useSequence(STAGES)
  const [manualExpanded, setManualExpanded] = useState<boolean | null>(null)
  const [selectedTool, setSelectedTool] = useState<string | null>(null)
  const v = VARIANTS[variant] ?? VARIANTS.Steps
  const autoExpanded = stage >= 1 && stage < 4
  const expanded = manualExpanded ?? autoExpanded
  const working = stage < 3
  const visible = stage < 2 ? 0 : stage === 2 ? Math.min(2, v.rows.length) : v.rows.length
  const traceRef = useRef<HTMLDivElement>(null)
  const [lineHeight, setLineHeight] = useState(0)
  useLayoutEffect(() => {
    if (traceRef.current) setLineHeight(traceRef.current.offsetHeight)
  }, [visible, expanded, variant, stage])

  const settledRef = useRef(false)
  useEffect(() => {
    if (working || settledRef.current) return
    settledRef.current = true
    onSettled?.()
  }, [working, onSettled])

  return (
    <div
      key={variant}
      className={cn("flex w-full max-w-95 flex-col", className)}
      style={{
        minHeight: working || expanded ? 176 : undefined,
        transition: "min-height 400ms cubic-bezier(0.23,1,0.32,1)",
      }}
    >
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => setManualExpanded((current) => !(current ?? autoExpanded))}
        className="-mx-1.5 flex w-fit items-center gap-2 rounded-md px-1.5 py-1 transition-colors duration-100 hover:bg-muted"
      >
        <Sparkle
          className="size-4"
          fill={working ? "var(--secondary-foreground)" : "var(--secondary-foreground)"}
          stroke="none"
        />
        <span role="status" className="contents">
          {working ? (
            <span
              className="bg-clip-text text-[13px] font-medium whitespace-nowrap text-transparent"
              style={{
                animation: "shimmer-text 1.4s linear infinite",
                backgroundImage:
                  "linear-gradient(90deg, var(--secondary-foreground) 35%, var(--foreground) 50%, var(--secondary-foreground) 65%)",
                backgroundSize: "200% 100%",
              }}
            >
              {v.active}
            </span>
          ) : (
            <span
              className="text-[13px] font-medium whitespace-nowrap text-foreground/75"
              style={{ animation: "fade-in 350ms ease-out both" }}
            >
              {v.done}
            </span>
          )}
        </span>
        <ChevronDown
          className="size-3.5 text-foreground/75 transition-transform duration-300"
          style={{ transform: expanded ? "rotate(180deg)" : "rotate(0)" }}
        />
      </button>

      <div
        className="grid transition-[grid-template-rows,opacity] duration-400"
        style={{
          gridTemplateRows: expanded ? "1fr" : "0fr",
          opacity: expanded ? 1 : 0,
          transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      >
        <div className="overflow-hidden">
          <div className="relative mt-1 ml-[5px] pl-4">
            <span
              aria-hidden
              className="absolute left-[3px] w-px bg-border"
              style={{ height: lineHeight ? lineHeight - 2 : 0, top: -8, transition: "height 500ms cubic-bezier(0.23,1,0.32,1)" }}
            />
            <div ref={traceRef} className="flex flex-col gap-1 py-1">
              {v.query && (
                <div
                  className="flex h-6 items-center gap-2 px-1.5"
                  style={{ animation: expanded ? "fade-up 300ms cubic-bezier(0.23,1,0.32,1) both" : undefined }}
                >
                  <Search className="size-3.5 shrink-0 text-foreground/75" strokeWidth={2} />
                  <span className="text-[12.5px] text-foreground/75">{v.query}</span>
                </div>
              )}
              {v.rows.slice(0, visible).map((row, i) => {
                const content: ReactNode = (
                  <>
                    {variant === "Search" && <Dot tone={TONES[i % 3]} />}
                    {variant === "Steps" &&
                      (i < visible - 1 || !working ? (
                        <Check className="size-3.5 shrink-0 text-foreground/75" strokeWidth={2.5} />
                      ) : (
                        <span
                          className="size-3 shrink-0 rounded-full border-[1.5px] border-border border-t-secondary-foreground"
                          style={{ animation: "spin 700ms linear infinite" }}
                        />
                      ))}
                    <span
                      className={cn(
                        "min-w-0 truncate text-[12.5px]",
                        variant === "Reasoning" ? "whitespace-normal leading-relaxed text-foreground/75" : "font-medium text-foreground",
                        variant === "Search" && "animated-underline"
                      )}
                    >
                      {row.primary}
                    </span>
                    {row.secondary && (
                      <span className={cn("shrink-0 text-[11.5px] text-foreground/75", row.mono && "font-mono")}>{row.secondary}</span>
                    )}
                    {row.add !== undefined && (
                      <span className="shrink-0 font-mono text-[11px] tabular-nums">
                        <span className="text-affirmative">+{row.add}</span> <span className="text-destructive">−{row.del}</span>
                      </span>
                    )}
                  </>
                )
                const rowClass = "flex min-h-7 w-full items-center gap-2 rounded-md px-1.5 py-0.5 text-left"
                const animation = { animation: `fade-up 320ms cubic-bezier(0.23,1,0.32,1) ${i * 120}ms both` }

                if (variant === "Search") {
                  return (
                    <a key={row.primary} href={row.href} target="_blank" rel="noreferrer" className={cn(rowClass, "transition-colors duration-150 hover:bg-muted")} style={animation}>
                      {content}
                    </a>
                  )
                }

                if (variant === "Coding") {
                  const selected = selectedTool === row.primary
                  return (
                    <button
                      key={row.primary}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setSelectedTool(selected ? null : row.primary)}
                      className={cn(rowClass, "transition-colors duration-150", selected ? "bg-muted" : "hover:bg-muted")}
                      style={animation}
                    >
                      {content}
                    </button>
                  )
                }

                return (
                  <div key={row.primary} className={rowClass} style={animation}>
                    {content}
                  </div>
                )
              })}
              {variant === "Search" && stage >= 3 && (
                <span className="text-[12px] text-foreground/75" style={{ animation: "fade-in 300ms ease-out both" }}>
                  +7 more
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
