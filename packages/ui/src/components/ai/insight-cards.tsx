"use client"

import { useMemo, useState } from "react"
import type { ReactNode } from "react"
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react"
import { Line, LineChart, ResponsiveContainer, Tooltip, YAxis } from "recharts"

import { IconButton } from "@workspace/ui/components/animate-ui/components/buttons/icon"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

/* Paged agent insights with scrub-ready live charts. Ported from
 * beautifui.dev; the original's custom "liveline" chart engine is replaced
 * with recharts (already a dependency here) so the design system doesn't
 * take on a second charting library. */

const formatPercent = (v: number) => `${v > 0 ? "+" : ""}${v.toFixed(2)}%`
const formatMoney = (v: number) => `$${Math.round(v).toLocaleString("en-US")}`

function Entity({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center gap-1 align-baseline font-[weight:var(--font-body-weight-action)] text-foreground">
      <span className="inline-block size-2.5 rounded-full bg-destructive" />@{name}
    </span>
  )
}

function Mono({ children, tone }: { children: ReactNode; tone: "red" | "green" }) {
  return <code className={cn("text-xs", tone === "red" ? "text-destructive" : "text-affirmative-foreground")}>{children}</code>
}

function CardChrome({ children }: { children: ReactNode }) {
  return <div className="min-h-[278px] rounded-lg bg-card p-3 ring-1 ring-foreground/10">{children}</div>
}

function ChartTooltip({ active, payload, formatter }: { active?: boolean; payload?: { name: string; value: number; color?: string }[]; formatter: (v: number) => string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="flex items-center gap-3 rounded-md border border-border bg-foreground px-2.5 py-1.5 text-xs whitespace-nowrap text-background tabular-nums shadow-lg">
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
  { color: "var(--color-destructive)", dot: "bg-destructive", name: "Mint Chip", sub: "-$2,377.66", tone: "red", values: [-2.9, -3.4, -3.05, -3.86, -3.52, -4.1, -3.82, -4.41] },
  { color: "var(--color-primary)", dot: "bg-primary", name: "Pistachio", sub: "+$617.22", tone: "green", values: [0.22, 0.58, 0.42, 0.91, 0.76, 1.08, 0.96, 1.15] },
]

function CompareCard({ series = COMPARE_SERIES }: { series?: CompareSeries[] }) {
  const chartData = useMemo(() => series[0].values.map((_, i) => Object.fromEntries(series.map((s) => [s.name, s.values[i]]))), [series])

  return (
    <CardChrome>
      <div className="flex items-center gap-4">
        {series.map((s) => (
          <div key={s.name} className="flex-1">
            <span className="flex items-center gap-1.5 text-xs text-foreground/75">
              <span className={cn("size-2 rounded-full", s.dot)} />
              {s.name}
            </span>
            <span className={cn("block text-lg font-[weight:var(--font-body-weight-emphasis)] tracking-[-0.01em] tabular-nums", s.tone === "red" ? "text-destructive" : "text-affirmative-foreground")}>{formatPercent(s.values.at(-1) ?? 0)}</span>
            <Mono tone={s.tone}>{s.sub}</Mono>
          </div>
        ))}
      </div>
      <div className="mt-2 overflow-hidden rounded-md bg-muted ring-1 ring-foreground/10">
        <div className="flex items-center justify-between border-b border-border px-2.5 py-1.5">
          <span className="text-xs text-foreground/75 tabular-nums">Trend snapshot</span>
          <span className="rounded-(--radius) bg-card px-2 py-0.5 text-xs font-[weight:var(--font-body-weight-action)] text-foreground/75">Snapshot</span>
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
        <span className="flex items-center gap-1.5 text-xs font-[weight:var(--font-body-weight-action)] text-foreground">
          <TrendingUp className="size-3 text-destructive" strokeWidth={2.5} />
          High freezer spend
        </span>
        <span className="rounded-(--radius) bg-muted px-2 py-0.5 text-xs font-[weight:var(--font-body-weight-action)] text-foreground/75">Snapshot</span>
      </div>
      <div className="mt-2 overflow-hidden rounded-md bg-muted ring-1 ring-foreground/10">
        <div className="flex items-center justify-between border-b border-border px-2.5 py-1.5">
          <span className="text-xs text-foreground/75 tabular-nums">{metric === "spend" ? `${moneyLabel} threshold` : "82 kWh threshold"}</span>
          <span className="flex rounded-(--radius-button) bg-card p-0.5">
            {(["spend", "usage"] as const).map((item) => (
              <Button
                key={item}
                type="button"
                variant="ghost"
                size="xs"
                aria-pressed={metric === item}
                onClick={() => setMetric(item)}
                className={cn("px-2", metric === item ? "bg-muted" : "text-foreground/75")}
              >
                {item === "spend" ? "Spend" : "Usage"}
              </Button>
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
        <span className="text-lg font-[weight:var(--font-body-weight-emphasis)] tracking-[-0.01em] text-foreground tabular-nums">{moneyLabel} spent</span>
        <Mono tone="red">+$1,834.66</Mono>
        <span className="text-xs text-foreground/75">vs 3 months</span>
      </div>
    </CardChrome>
  )
}

export type AllocationSegment = { name: string; label: string; pct: number; amount: string; cls: string; tone: string }

const ALLOCATION_SEGMENTS: AllocationSegment[] = [
  { amount: "$51,785", cls: "bg-destructive", label: "Vanilla", name: "VAN", pct: 72.5, tone: "text-destructive" },
  { amount: "$16,278", cls: "bg-border", label: "Chocolate", name: "CHOC", pct: 22.8, tone: "text-foreground/75" },
  { amount: "$3,357", cls: "bg-muted", label: "Mint", name: "MINT", pct: 4.7, tone: "text-foreground/75" },
]

function AllocationCard({ segments = ALLOCATION_SEGMENTS }: { segments?: AllocationSegment[] }) {
  const [selected, setSelected] = useState(segments[0].name)
  const active = segments.find((segment) => segment.name === selected) ?? segments[0]

  return (
    <CardChrome>
      <span className="flex items-center gap-1.5 text-xs font-[weight:var(--font-body-weight-action)] text-foreground">
        <span className="flex size-3.5 items-center justify-center rounded-full bg-destructive text-[8px] font-[weight:var(--font-body-weight-emphasis)] text-primary-foreground">V</span>
        Vanilla allocation
      </span>
      <span className="mt-1 block text-lg font-[weight:var(--font-body-weight-emphasis)] tracking-[-0.01em] text-foreground tabular-nums">{active.amount}</span>
      <div className="mt-3 flex h-9 gap-0.5 overflow-hidden rounded-(--radius-button) bg-muted p-0.5" role="group" aria-label="Allocation segments">
        {segments.map((s) => (
          <button
            key={s.name}
            type="button"
            aria-pressed={selected === s.name}
            aria-label={`${s.label}: ${s.pct}%`}
            onClick={() => setSelected(s.name)}
            className={cn("relative h-full overflow-hidden rounded-(--radius-button) transition-[opacity,transform] duration-(--motion-duration) active:scale-[0.98]", s.cls)}
            style={{ opacity: selected === s.name ? 1 : 0.58, transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)", width: `${s.pct}%` }}
          />
        ))}
      </div>
      <div className="mt-2 flex items-center gap-1.5">
        {segments.map((s) => (
          <Button
            key={s.name}
            type="button"
            variant="ghost"
            size="xs"
            aria-pressed={selected === s.name}
            onClick={() => setSelected(s.name)}
            className={cn("gap-1 px-1.5", selected === s.name ? "bg-muted" : "text-foreground/75")}
          >
            <span className={cn("size-1.5 rounded-full", s.cls)} />
            {s.name} <span className="tabular-nums">{s.pct}%</span>
          </Button>
        ))}
      </div>
      <div className="mt-3 min-h-16 rounded-md bg-muted px-2.5 py-2 ring-1 ring-foreground/10">
        <span className={cn("block text-xs font-[weight:var(--font-body-weight-action)]", active.tone)}>{active.label}</span>
        <span className="mt-1 block text-xs leading-relaxed text-foreground/75">Contribution snapshot across current inventory value. Segment selection changes the inspected group without moving the card.</span>
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
        Unusually high freezer bill on <span className="font-[weight:var(--font-body-weight-action)] text-foreground">Dec 13</span> — <Mono tone="red">+$1,834.66</Mono> above your average.
      </>
    ),
  },
  {
    Card: AllocationCard,
    key: "allocation",
    pill: "If we look at seasonals, what changes?",
    prose: (
      <>
        You're heavily invested in <Entity name="Vanilla" /> — it's <span className="font-[weight:var(--font-body-weight-action)] text-foreground">72.5%</span> of your case.
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
          <span className="text-sm font-[weight:var(--font-body-weight-emphasis)] text-foreground">{l.title}</span>
          <span className="text-sm text-foreground/75 tabular-nums">{pages.length}</span>
        </span>
        <span className="flex items-center gap-0.5">
          <IconButton aria-label="Previous insight" onClick={() => move(-1)} variant="ghost" size="xs">
            <ChevronLeft strokeWidth={2.2} />
          </IconButton>
          <IconButton aria-label="Next insight" onClick={() => move(1)} variant="ghost" size="xs">
            <ChevronRight strokeWidth={2.2} />
          </IconButton>
        </span>
      </div>

      <div>
        <p className="mt-1.5 text-xs leading-relaxed text-foreground/75">{prose}</p>
        <div className="mt-2">
          <Card />
        </div>
        <Button type="button" variant="outline" size="xs" className="mt-2">{pill}</Button>
      </div>
    </div>
  )
}
