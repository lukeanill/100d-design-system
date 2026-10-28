"use client"

import { useRef, useState, type ComponentProps, type ReactNode } from "react"
import { TrendUpIcon } from "@phosphor-icons/react"

import { cn } from "@workspace/ui/lib/utils"
import { useDelayedInView } from "@workspace/ui/hooks/use-delayed-in-view"
import { SlidingNumber } from "@workspace/ui/components/animate-ui/primitives/texts/sliding-number"
import { NativeSelect, NativeSelectOption } from "@workspace/ui/components/native-select"
import { ThemedCard } from "@workspace/ui/components/themed-card"
import { ThemedIcon } from "@workspace/ui/components/themed-icon"

/* A figure for a chosen period: a label, a select that switches the period, the figure as a sliding
 * number (it counts up when the card comes into view, and again whenever the period changes) and how
 * much it has moved. Built on the component guidelines: the theme's card, a themed select and popup,
 * the theme's heading face for the figure, Phosphor icons. */

export type StatPeriod = { id: string; label: string; value: number; change: number }

const PERIODS: StatPeriod[] = [
  { change: 9, id: "today", label: "today", value: 38 },
  { change: 400, id: "month", label: "this month", value: 1900 },
  { change: 900, id: "year", label: "this year", value: 9800 },
]

export interface StatCardProps {
  label?: string
  periods?: StatPeriod[]
  defaultPeriod?: string
  /** How long the card is in view before its figures appear, in ms. */
  startDelay?: number
  className?: string
}

function FigureRow({
  period,
  figure,
  trendHidden = false,
  className,
  ...props
}: {
  period: StatPeriod
  /** The figure to show in place of the plain number; without it the number only holds its place. */
  figure?: ReactNode
  trendHidden?: boolean
} & ComponentProps<"div">) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      {figure ?? <span className="text-heading-h3 invisible">{period.value.toLocaleString("en-US")}</span>}
      <div
        className={cn(
          "flex items-center gap-1 text-chart-2 transition-opacity duration-(--motion-fast) ease-(--motion-transition-ease)",
          trendHidden ? "opacity-0" : "opacity-100"
        )}
      >
        <ThemedIcon phosphor={TrendUpIcon} />
        <span className="text-body-md">{period.change.toLocaleString("en-US")}</span>
      </div>
    </div>
  )
}

export function StatCard({ label = "New followers", periods = PERIODS, defaultPeriod, startDelay = 1000, className }: StatCardProps) {
  const [id, setId] = useState(defaultPeriod ?? periods[Math.min(1, periods.length - 1)].id)
  const seen = useRef<HTMLDivElement | null>(null)
  const started = useDelayedInView(seen, startDelay)
  const period = periods.find((p) => p.id === id) ?? periods[0]

  return (
    <ThemedCard ref={seen} className={className}>
      {/* the label holds the left edge and the select the right, whatever width the card is */}
      <div className="flex items-center justify-between gap-2">
        <p className="text-body-md whitespace-nowrap">{label}</p>
        <NativeSelect themed aria-label="Period" value={id} onChange={(event) => setId(event.target.value)}>
          {periods.map((p) => (
            <NativeSelectOption key={p.id} value={p.id}>
              {p.label}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>

      {/* The card is sized by its widest and tallest figure, not the one on show: every period's row sits in the same cell, unseen,
          and the shown row on top of them, so choosing another period never moves the card. The figures wait for the pause, then count up. */}
      <div className="grid">
        {periods.map((p) => (
          <FigureRow key={p.id} period={p} className="invisible col-start-1 row-start-1" aria-hidden />
        ))}
        <FigureRow
          period={period}
          figure={started ? <SlidingNumber number={period.value} thousandSeparator="," className="text-heading-h3 text-foreground" /> : null}
          trendHidden={!started}
          className="col-start-1 row-start-1"
        />
      </div>
    </ThemedCard>
  )
}
