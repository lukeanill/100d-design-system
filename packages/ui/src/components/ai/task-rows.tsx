"use client"

import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import { Check, ChevronDown, RefreshCw, X } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"

/* Live agent task status — running, failed, completed — with expandable
 * detail rows. Ported from beautifui.dev. */

const TICKS = [600, 900, 2400, 1400, 2400, 600]

function useTick(intervals: number[]) {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    if (tick >= intervals.length - 1) return
    const t = setTimeout(() => setTick((x) => x + 1), intervals[tick])
    return () => clearTimeout(t)
  }, [tick, intervals])
  return tick
}

function SpinnerRing({ active, children }: { active?: boolean; children?: ReactNode }) {
  const size = 24
  const stroke = 2
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <span className="relative inline-flex shrink-0 items-center justify-center" style={{ height: size, width: size }}>
      <svg width={size} height={size} className="absolute inset-0" style={active ? { animation: "spin 1.1s linear infinite" } : undefined}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
        {active && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--secondary-foreground)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${c * 0.28} ${c * 0.72}`}
          />
        )}
      </svg>
      <span className="relative text-[10.5px] font-semibold tabular-nums text-foreground">{children}</span>
    </span>
  )
}

function Badge({ tone, children }: { tone: "red" | "green"; children: ReactNode }) {
  return (
    <span
      className={cn("flex size-5.5 shrink-0 items-center justify-center rounded-full text-white", tone === "red" ? "bg-destructive" : "bg-affirmative")}
      style={{ animation: "pop-in 300ms cubic-bezier(0.23,1,0.32,1) both" }}
    >
      {children}
    </span>
  )
}

export type TaskDetail = { label: string; meta: string }

export type TaskRow = {
  key: string
  label: string
  amount: string
  status: "done" | "running" | "sequence"
  step?: number
  details: TaskDetail[]
}

export type TaskRowsLabels = {
  completed: string
  failed: string
}

const DEFAULT_LABELS: TaskRowsLabels = {
  completed: "Completed",
  failed: "Failed",
}

const TASK_ROWS: TaskRow[] = [
  {
    amount: "12 suppliers",
    details: [
      { label: "Matched tax and contact IDs", meta: "12/12" },
      { label: "Flagged stale records", meta: "0" },
    ],
    key: "verify",
    label: "Verified vendor records",
    status: "done",
  },
  {
    amount: "7 SKUs",
    details: [
      { label: "Reading POS export", meta: "3 files" },
      { label: "Scoring stockout risk", meta: "68%" },
    ],
    key: "index",
    label: "Build reorder task list",
    status: "running",
    step: 2,
  },
  {
    amount: "2 messages",
    details: [
      { label: "Cone supplier follow-up", meta: "draft" },
      { label: "Pistachio reorder note", meta: "draft" },
    ],
    key: "draft",
    label: "Draft supplier emails",
    status: "sequence",
    step: 3,
  },
]

export interface TaskRowsProps {
  appearance?: {
    variant?: "Capsules" | "List"
  }
  data?: {
    rows?: TaskRow[]
  }
  labels?: Partial<TaskRowsLabels>
  actions?: {
    onToggleRow?: (key: string, open: boolean) => void
  }
  className?: string
}

export const TaskRows = ({ appearance, data, labels, actions, className }: TaskRowsProps = {}) => {
  const variant = appearance?.variant ?? "Capsules"
  const rows = data?.rows ?? TASK_ROWS
  const tick = useTick(TICKS)
  const [manualOpen, setManualOpen] = useState<Record<string, boolean>>({})
  const row2: "pending" | "failed" | "done" = tick < 3 ? "pending" : tick === 3 ? "failed" : "done"
  const copy = { ...DEFAULT_LABELS, ...labels }

  const badgeFor = (row: TaskRow) => {
    if (row.status === "done") return <Badge tone="green"><Check className="size-3" strokeWidth={3.5} /></Badge>
    if (row.status === "running") return <SpinnerRing active>{row.step}</SpinnerRing>
    return row2 === "pending" ? (
      <SpinnerRing>{row.step}</SpinnerRing>
    ) : row2 === "failed" ? (
      <Badge tone="red"><X className="size-3" strokeWidth={3.5} /></Badge>
    ) : (
      <Badge tone="green"><Check className="size-3" strokeWidth={3.5} /></Badge>
    )
  }

  const pillFor = (row: TaskRow) => {
    if (row.status === "done")
      return <span className="inline-flex h-5.5 items-center rounded-full bg-affirmative/15 px-2 text-[11.5px] font-medium text-affirmative">{copy.completed}</span>
    if (row.status === "running") return null
    return row2 === "failed" ? (
      <span className="inline-flex h-5.5 items-center gap-1.5 rounded-full bg-destructive/10 px-2 text-[11.5px] font-medium text-destructive" style={{ animation: "fade-in 200ms ease-out both" }}>
        {copy.failed} <RefreshCw className="size-3" style={{ animation: "spin 1.2s linear infinite" }} />
      </span>
    ) : row2 === "done" ? (
      <span className="inline-flex h-5.5 items-center gap-1.5 rounded-full bg-affirmative/15 px-2 text-[11.5px] font-medium text-affirmative" style={{ animation: "fade-in 200ms ease-out both" }}>
        {copy.completed}
      </span>
    ) : null
  }

  const list = variant === "List"
  return (
    <div className={cn("flex w-full max-w-110 flex-col", list ? "gap-0 self-start overflow-hidden rounded-lg bg-card ring-1 ring-foreground/10" : "min-h-[196px] gap-2", className)}>
      {rows.map((row, i) => {
        const open = manualOpen[row.key] ?? (row.key === "index" && tick === 2)
        return (
          <div
            key={row.key}
            className={cn(
              "self-stretch overflow-hidden transition-[border-radius,background-color] duration-300 hover:bg-muted",
              list ? "border-b border-border last:border-0" : "bg-card ring-1 ring-foreground/10"
            )}
            style={{ animation: `fade-up 450ms cubic-bezier(0.23,1,0.32,1) ${i * 80}ms both`, borderRadius: list ? 0 : open ? 14 : 22 }}
          >
            <button
              type="button"
              aria-expanded={open}
              onClick={() => {
                setManualOpen((current) => ({ ...current, [row.key]: !open }))
                actions?.onToggleRow?.(row.key, !open)
              }}
              className="flex h-11 w-full items-center gap-2.5 px-2.5 text-left"
            >
              <span className="flex size-6 shrink-0 items-center justify-center">{badgeFor(row)}</span>
              <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-foreground">{row.label}</span>
              <span className="text-[12.5px] text-secondary-foreground tabular-nums">{row.amount}</span>
              {pillFor(row)}
              <span aria-hidden="true" className="-ml-2 flex size-7 shrink-0 items-center justify-center rounded-full text-secondary-foreground">
                <ChevronDown className="size-3.5 transition-transform duration-300" style={{ transform: open ? "rotate(180deg)" : "rotate(0)" }} />
              </span>
            </button>

            <div
              className="grid transition-[grid-template-rows,opacity] duration-300"
              style={{ gridTemplateRows: open ? "1fr" : "0fr", opacity: open ? 1 : 0, transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
            >
              <div className="overflow-hidden">
                <div className="mb-2.5 grid grid-cols-[24px_1fr] gap-2.5 px-2.5">
                  <span aria-hidden className="mx-auto h-full w-px bg-border" />
                  <div className="flex flex-col gap-1.5">
                    {row.details.map((d, j) => (
                      <div key={d.label} className="flex items-center justify-between" style={open ? { animation: `fade-up 300ms cubic-bezier(0.23,1,0.32,1) ${120 + j * 100}ms both` } : undefined}>
                        <span className="text-[12px] text-secondary-foreground">{d.label}</span>
                        <span className="font-mono text-[11.5px] text-secondary-foreground tabular-nums">{d.meta}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
