import * as React from "react"

import { cn } from "@workspace/ui/lib/utils"
import {
  ACTIVITY_SLOTS,
  activityColor,
  type ActivitySurface,
} from "@workspace/ui/lib/activity-palette"

export type ActivityDatum = {
  /** Stable category id — what the colour is pinned to. */
  id: string
  /** Human name, used in the text alternative. Never rendered at this size. */
  label: string
  count: number
}

/**
 * A glanceable "how busy, and with what" for a single day: one bar per
 * category, height by event count.
 *
 * Small enough to sit under a date in a calendar cell, which sets the rules.
 * There is no room for a legend or axis, so the marks cannot be the only way in
 * — the whole thing carries a text alternative naming every category and its
 * count, and that is what screen readers and hover both read.
 *
 * Colour is pinned to the category, not to rank, so the bars stay in the order
 * given rather than sorting by size. A category that overtakes another must not
 * swap colours with it; that is the difference between a colour meaning
 * "meetings" and meaning "the tall one".
 */
function DayActivity({
  data,
  max,
  height = 12,
  barWidth = 3,
  gap = 2,
  scale = "sqrt",
  surface = "light",
  className,
  ...props
}: {
  data: ActivityDatum[]
  /**
   * Height of a full bar, in events. Pass the busiest day's count when several
   * of these sit side by side: scaled to its own maximum, every day looks
   * equally busy and the comparison the row exists to support is lost.
   */
  max?: number
  height?: number
  barWidth?: number
  gap?: number
  /**
   * How counts map to height.
   *
   * `sqrt` (default) — at twelve pixels shared across a month, a linear scale
   * puts a one-event day at a single pixel next to a nine-event day, and every
   * quiet day collapses into the same dot. Square root lifts the bottom of the
   * range into visible territory while keeping the order and the sense of "much
   * more" intact. It is the right trade for a glanceable mark whose exact
   * numbers are read from the text alternative, not measured off the bars.
   *
   * `linear` — true proportion. Use it where the bars are large enough to be
   * measured and the comparison has to be exact.
   */
  scale?: "sqrt" | "linear"
  surface?: ActivitySurface
  className?: string
} & Omit<React.ComponentProps<"div">, "children">) {
  const shown = data.filter((d) => d.count > 0)
  const ceiling = Math.max(max ?? 0, ...shown.map((d) => d.count), 1)
  const total = shown.reduce((n, d) => n + d.count, 0)

  // everything past the fifth category shares the neutral step, so say so once
  // rather than listing six colours the eye cannot separate anyway
  const described = shown
    .map((d, i) => `${d.count} ${d.label}${i >= ACTIVITY_SLOTS ? " (other)" : ""}`)
    .join(", ")

  if (!shown.length) {
    return (
      <div
        className={cn("flex items-end", className)}
        style={{ height }}
        role="img"
        aria-label="No activity"
        {...props}
      />
    )
  }

  return (
    <div
      className={cn("flex items-end", className)}
      style={{ height, gap }}
      role="img"
      aria-label={`${total} ${total === 1 ? "event" : "events"}: ${described}`}
      title={described}
      {...props}
    >
      {shown.map((d, i) => (
        <span
          key={d.id}
          style={{
            width: barWidth,
            // a single event still has to be visible, so the floor is 3px
            // rather than a proportional sliver that rounds away to nothing
            height: Math.max(
              3,
              Math.round(
                (scale === "sqrt"
                  ? Math.sqrt(d.count / ceiling)
                  : d.count / ceiling) * height
              )
            ),
            background: activityColor(i, surface),
            borderRadius: 1,
          }}
        />
      ))}
    </div>
  )
}

export { DayActivity }
