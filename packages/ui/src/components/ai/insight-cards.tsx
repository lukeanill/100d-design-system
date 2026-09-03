"use client"

import { useMemo, useState } from "react"
import type { ReactNode } from "react"
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react"
import { Line, LineChart, ResponsiveContainer, Tooltip, YAxis } from "recharts"

import { cn } from "@workspace/ui/lib/utils"

/* Paged agent insights with scrub-ready live charts. Ported from
 * beautifui.dev; the original's custom "liveline" chart engine is replaced
 * with recharts (already a dependency here) so the design system doesn't
 * take on a second charting library. */

const formatPercent = (v: number) => `${v > 0 ? "+" : ""}${v.toFixed(2)}%`
const formatMoney = (v: number) => `$${Math.round(v).toLocaleString("en-US")}`

function Entity({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center gap-1 align-baseline font-medium text-foreground">
      <span className="inline-block size-2.5 rounded-full bg-amber-500" />@{name}
    </span>
  )
}

function Mono({ children, tone }: { children: ReactNode; tone: "red" | "green" }) {
  return <code className={cn("font-mono text-[11.5px]", tone === "red" ? "text-destructive" : "text-affirmative")}>{children}</code>
}

function CardChrome({ children }: { children: ReactNode }) {
  return <div className="min-h-[278px] rounded-lg bg-card p-3 ring-1 ring-foreground/10">{children}</div>
}

function ChartTooltip({ active, payload, formatter }: { active?: boolean; payload?: { name: string; value: number; color?: string }[]; formatter: (v: number) => string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="flex items-center gap-3 rounded-md border border-border bg-foreground px-2.5 py-1.5 text-[11.5px] whitespace-nowrap text-background tabular-nums shadow-lg">
      {payload.map((row) => (
        <span key={row.name} className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full" style={{ background: row.color }} />
          {formatter(row.value)}
        </span>
      ))}
    </div>
  )
}

export type CompareSeries = {
  name: string
  values: number[]
  sub: string
  tone: "red" | "green"
  dot: string
  color: string
}

const COMPARE_SERIES: CompareSeries[] = [
  { color: "var(--color-amber-500, #f59e0b)", dot: "bg-amber-500", name: "Mint Chip", sub: "-$2,377.66", tone: "red", values: [-2.9, -3.4, -3.05, -3.86, -3.52, -4.1, -3.82, -4.41] },
  { color: "var(--color-primary)", dot: "bg-primary", name: "Pistachio", sub: "+$617.22", tone: "green", values: [0.22, 0.58, 0.42, 0.91, 0.76, 1.08, 0.96, 1.15] },
]

function CompareCard({ series = COMPARE_SERIES }: { series?: CompareSeries[] }) {
  const chartData = useMemo(() => series[0].values.map((_, i) => Object.fromEntries(series.map((s) => [s.name, s.values[i]]))), [series])

  return (
    <CardChrome>
      <div className="flex items-center gap-4">
        {series.map((s) => (
          <div key={s.name} className="flex-1">
            <span className="flex items-center gap-1.5 text-[11.5px] text-secondary-foreground">
              <span className={cn("size-2 rounded-full", s.dot)} />
              {s.name}
            </span>
            <span className={cn("block text-[17px] font-semibold tracking-[-0.01em] tabular-nums", s.tone === "red" ? "text-destructive" : "text-affirmative")}>{formatPercent(s.values.at(-1) ?? 0)}</span>
            <Mono tone={s.tone}>{s.sub}</Mono>
          </div>
        ))}
      </div>
      <div className="mt-2 overflow-hidden rounded-md bg-muted ring-1 ring-foreground/10">
        <div className="flex items-center justify-between border-b border-border px-2.5 py-1.5">
          <span className="text-[11px] text-secondary-foreground tabular-nums">Trend snapshot</span>
          <span className="rounded-full bg-card px-2 py-0.5 text-[10.5px] font-medium text-secondary-foreground">Snapshot</span>
        </div>
        <div className="h-[166px] pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ bottom: 8, left: 8, right: 8, top: 4 }}>
              <YAxis hide domain={["dataMin - 0.5", "dataMax + 0.5"]} />
              <Tooltip content={<ChartTooltip formatter={formatPercent} />} cursor={{ stroke: "var(--border)" }} />
              {series.map((s) => (
                <Line key={s.name} dataKey={s.name} type="monotone" stroke={s.color} strokeWidth={2.25} dot={false} isAnimationActive={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </CardChrome>
  )
}

export type AnomalyData = { spend: number[]; usage: number[] }

const ANOMALY_DATA: AnomalyData = { spend: [274, 289, 264, 307, 331, 1210, 1718, 2112], usage: [18, 19, 17, 21, 22, 58, 81, 96] }

function AnomalyCard({ data: anomaly = ANOMALY_DATA }: { data?: AnomalyData }) {
  const [metric, setMetric] = useState<"spend" | "usage">("spend")
  const values = metric === "spend" ? anomaly.spend : anomaly.usage
  const chartData = useMemo(() => values.map((value) => ({ value })), [values])
  const moneyLabel = formatMoney(anomaly.spend.at(-1) ?? 2112)
  const formatValue = metric === "spend" ? formatMoney : (v: number) => `${Math.round(v)} kWh`

  return (
    <CardChrome>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[12px] font-medium text-foreground">
          <TrendingUp className="size-3 text-destructive" strokeWidth={2.5} />
          High freezer spend
        </span>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[10.5px] font-medium text-secondary-foreground">Snapshot</span>
      </div>
      <div className="mt-2 overflow-hidden rounded-md bg-muted ring-1 ring-foreground/10">
        <div className="flex items-center justify-between border-b border-border px-2.5 py-1.5">
          <span className="text-[11px] text-secondary-foreground tabular-nums">{metric === "spend" ? `${moneyLabel} threshold` : "82 kWh threshold"}</span>
          <span className="flex rounded-full bg-card p-0.5">
            {(["spend", "usage"] as const).map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={metric === item}
                onClick={() => setMetric(item)}
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10.5px] font-medium transition-[background-color,color,box-shadow,transform] duration-150 active:scale-[0.96]",
                  metric === item ? "bg-muted text-foreground shadow-xs" : "text-secondary-foreground hover:text-foreground"
                )}
              >
                {item === "spend" ? "Spend" : "Usage"}
              </button>
            ))}
          </span>
        </div>
        <div className="h-[166px] pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ bottom: 8, left: 8, right: 8, top: 4 }}>
              <YAxis hide domain={["dataMin - 5", "dataMax + 5"]} />
              <Tooltip content={<ChartTooltip formatter={formatValue} />} cursor={{ stroke: "var(--border)" }} />
              <Line dataKey="value" type="monotone" stroke="var(--color-destructive)" strokeWidth={2.25} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-1.5 flex items-baseline gap-2">
        <span className="text-[17px] font-semibold tracking-[-0.01em] text-foreground tabular-nums">{moneyLabel} spent</span>
        <Mono tone="red">+$1,834.66</Mono>
        <span className="text-[11px] text-secondary-foreground">vs 3 months</span>
      </div>
    </CardChrome>
  )
}

export type AllocationSegment = { name: string; label: string; pct: number; amount: string; cls: string; tone: string }

const ALLOCATION_SEGMENTS: AllocationSegment[] = [
  { amount: "$51,785", cls: "bg-amber-500", label: "Vanilla", name: "VAN", pct: 72.5, tone: "text-amber-600 dark:text-amber-400" },
  { amount: "$16,278", cls: "bg-border", label: "Chocolate", name: "CHOC", pct: 22.8, tone: "text-secondary-foreground" },
  { amount: "$3,357", cls: "bg-muted", label: "Mint", name: "MINT", pct: 4.7, tone: "text-secondary-foreground" },
]

function AllocationCard({ segments = ALLOCATION_SEGMENTS }: { segments?: AllocationSegment[] }) {
  const [selected, setSelected] = useState(segments[0].name)
  const active = segments.find((segment) => segment.name === selected) ?? segments[0]

  return (
    <CardChrome>
      <span className="flex items-center gap-1.5 text-[12px] font-medium text-foreground">
        <span className="flex size-3.5 items-center justify-center rounded-full bg-amber-500 text-[8px] font-bold text-white">V</span>
        Vanilla allocation
      </span>
      <span className="mt-1 block text-[20px] font-semibold tracking-[-0.01em] text-foreground tabular-nums">{active.amount}</span>
      <div className="mt-3 flex h-9 gap-0.5 overflow-hidden rounded-full bg-muted p-0.5" role="group" aria-label="Allocation segments">
        {segments.map((s) => (
          <button
            key={s.name}
            type="button"
            aria-pressed={selected === s.name}
            aria-label={`${s.label}: ${s.pct}%`}
            onClick={() => setSelected(s.name)}
            className={cn("relative h-full overflow-hidden rounded-full transition-[opacity,transform] duration-300 active:scale-[0.98]", s.cls)}
            style={{ opacity: selected === s.name ? 1 : 0.58, transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)", width: `${s.pct}%` }}
          />
        ))}
      </div>
      <div className="mt-2 flex items-center gap-1.5">
        {segments.map((s) => (
          <button
            key={s.name}
            type="button"
            aria-pressed={selected === s.name}
            onClick={() => setSelected(s.name)}
            className={cn(
              "flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] transition-[background-color,color,transform] duration-150 active:scale-[0.96]",
              selected === s.name ? "bg-muted text-foreground" : "text-secondary-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <span className={cn("size-1.5 rounded-full", s.cls)} />
            {s.name} <span className="tabular-nums">{s.pct}%</span>
          </button>
        ))}
      </div>
      <div className="mt-3 min-h-16 rounded-md bg-muted px-2.5 py-2 ring-1 ring-foreground/10">
        <span className={cn("block text-[11.5px] font-medium", active.tone)}>{active.label}</span>
        <span className="mt-1 block text-[11px] leading-relaxed text-secondary-foreground">Contribution snapshot across current inventory value. Segment selection changes the inspected group without moving the card.</span>
      </div>
    </CardChrome>
  )
}

export type InsightPage = { key: string; prose: ReactNode; Card: React.ComponentType; pill: string }

const PAGES: InsightPage[] = [
  {
    Card: CompareCard,
    key: "compare",
    pill: "Should I rebalance flavors?",
    prose: (
      <>
        The worst performer in your <Entity name="Creamery" /> is Rocky Road — down <Mono tone="red">-6%</Mono> or <Mono tone="red">-$2,453.44</Mono>.
      </>
    ),
  },
  {
    Card: AnomalyCard,
    key: "anomaly",
    pill: "Get tips on cutting freezer costs",
    prose: (
      <>
        Unusually high freezer bill on <span className="font-medium text-foreground">Dec 13</span> — <Mono tone="red">+$1,834.66</Mono> above your average.
      </>
    ),
  },
  {
    Card: AllocationCard,
    key: "allocation",
    pill: "If we look at seasonals, what changes?",
    prose: (
      <>
        You're heavily invested in <Entity name="Vanilla" /> — it's <span className="font-medium text-foreground">72.5%</span> of your case.
      </>
    ),
  },
]

export type InsightCardsLabels = { title: string }

const DEFAULT_LABELS: InsightCardsLabels = { title: "Insights" }

export interface InsightCardsProps {
  data?: {
    pages?: InsightPage[]
  }
  labels?: Partial<InsightCardsLabels>
  className?: string
}

export const InsightCards = ({ data, labels, className }: InsightCardsProps = {}) => {
  const pages = data?.pages ?? PAGES
  const l = { ...DEFAULT_LABELS, ...labels }
  const [page, setPage] = useState(0)

  const move = (direction: -1 | 1) => {
    setPage((current) => (current + direction + pages.length) % pages.length)
  }

  const { prose, Card, pill } = pages[page]

  return (
    <div className={cn("min-h-[408px] w-full max-w-86", className)}>
      <div className="flex items-center justify-between">
        <span className="flex items-baseline gap-1.5">
          <span className="text-[13px] font-semibold text-foreground">{l.title}</span>
          <span className="text-[13px] text-secondary-foreground tabular-nums">{pages.length}</span>
        </span>
        <span className="flex items-center gap-0.5">
          <button
            aria-label="Previous insight"
            onClick={() => move(-1)}
            className="flex size-6 items-center justify-center rounded-md text-secondary-foreground transition-[background-color,color,transform] duration-100 hover:bg-muted hover:text-foreground active:scale-[0.96]"
          >
            <ChevronLeft className="size-3.5" strokeWidth={2.2} />
          </button>
          <button
            aria-label="Next insight"
            onClick={() => move(1)}
            className="flex size-6 items-center justify-center rounded-md text-secondary-foreground transition-[background-color,color,transform] duration-100 hover:bg-muted hover:text-foreground active:scale-[0.96]"
          >
            <ChevronRight className="size-3.5" strokeWidth={2.2} />
          </button>
        </span>
      </div>

      <div>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-secondary-foreground">{prose}</p>
        <div className="mt-2">
          <Card />
        </div>
        <button className="mt-2 rounded-full bg-card px-3 py-1.5 text-left text-[12px] text-foreground shadow-xs ring-1 ring-foreground/10 transition-colors duration-100 hover:bg-muted">{pill}</button>
      </div>
    </div>
  )
}
