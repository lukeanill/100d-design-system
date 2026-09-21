import * as React from "react"

import { cn } from "@workspace/ui/lib/utils"
import { activityColor, type ActivitySurface } from "@workspace/ui/lib/activity-palette"

export type TimelineEvent = {
  id: string
  /** "HH:MM", 24-hour. */
  at: string
  label: string
  /** Index into the fixed category order — decides both colour and shape. */
  category: number
  /** "×4 until 11:04" — a burst collapsed into one mark. */
  repeat?: { count: number; until: string }
}

const MARKS = ["circle", "diamond", "square", "triangle", "bar"] as const

const minutes = (at: string) => {
  const [h, m] = at.split(":").map(Number)
  return (h ?? 0) * 60 + (m ?? 0)
}

const hourLabel = (h: number) =>
  h === 0 ? "12AM" : h === 12 ? "12PM" : h < 12 ? `${h}AM` : `${h - 12}PM`

/**
 * One mark per event. Shape carries the category alongside colour, so the marks
 * survive colourblindness, greyscale printing and forced-colors mode — colour
 * alone would collapse two categories into one for some readers.
 */
function Mark({ category, surface }: { category: number; surface: ActivitySurface }) {
  const fill = activityColor(category, surface)
  const shape = MARKS[category] ?? "bar"
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" aria-hidden="true" focusable="false">
      {shape === "circle" && <circle cx="5.5" cy="5.5" r="4.5" fill={fill} />}
      {shape === "diamond" && <path d="M5.5 0.5 10.5 5.5 5.5 10.5 0.5 5.5Z" fill={fill} />}
      {shape === "square" && <rect x="1" y="1" width="9" height="9" rx="1.5" fill={fill} />}
      {shape === "triangle" && <path d="M5.5 0.75 10.5 9.75H0.5Z" fill={fill} />}
      {shape === "bar" && <rect x="0.5" y="3.5" width="10" height="4" rx="1.5" fill={fill} />}
    </svg>
  )
}

/** Height a label block needs, so two of them never sit on top of each other. */
const ROW = 24
const ROW_WITH_REPEAT = 40

/** Width of the gutter the leader lines are drawn in. */
const LEADER = 28

/**
 * A day as a vertical time axis: hours down the side, one mark per event at the
 * time it happened, and the event's name level with its mark.
 *
 * Three things make it readable, and all three are easy to get wrong:
 *
 * A rule on **every** hour, not every other one. Reading this is mostly "roughly
 * when, and how clustered" — across an unruled two-hour gap the eye
 * interpolates, and a mark at 10:55 drifts toward whichever neighbour it sits
 * nearer. Labels stay sparser than the rules so the axis is not a wall of text;
 * the labelled hours get a slightly stronger rule, which is enough hierarchy to
 * count by without turning the grid into content.
 *
 * The plot column is deliberately narrow. Time is the only axis here — spreading
 * the marks across a wide band invents a horizontal dimension that means
 * nothing, and pushes each mark away from its own label.
 *
 * Labels sit at their event's height rather than in a plain list, because the
 * pairing is the information. Where events collide they stack downward from
 * their true position, nearest-first, so the order is always right even when an
 * exact height cannot be — and a leader line runs from the mark to the label it
 * belongs to, so a label pushed down by a busy few minutes still says which
 * moment it came from rather than appearing to belong to a later hour. A label
 * that did not have to move needs no leader, so quiet stretches stay clean.
 */
function DayTimeline({
  events,
  from = 8,
  to = 18,
  surface = "light",
  labelEvery = 2,
  height = 360,
  className,
  ...props
}: {
  events: TimelineEvent[]
  /** First and last hour shown, 24-hour. */
  from?: number
  to?: number
  surface?: ActivitySurface
  /** Rule on every hour; label every `labelEvery`-th one. */
  labelEvery?: number
  /** Plot height in pixels — the space the hours are spread across. */
  height?: number
  className?: string
} & Omit<React.ComponentProps<"div">, "children">) {
  const startMin = from * 60
  const span = Math.max(1, (to - from) * 60)
  const hours = Array.from({ length: to - from + 1 }, (_, i) => from + i)
  const y = (min: number) => ((min - startMin) / span) * height

  const placed = events
    .map((e) => ({ ...e, min: minutes(e.at) }))
    .filter((e) => e.min >= startMin && e.min <= startMin + span)
    .sort((a, b) => a.min - b.min)

  // Push each label down only as far as the one above forces it to go, so a
  // sparse day keeps every label exactly level with its mark.
  let cursor = -Infinity
  const labels = placed.map((e) => {
    const top = Math.max(y(e.min), cursor)
    cursor = top + (e.repeat ? ROW_WITH_REPEAT : ROW)
    return { ...e, top }
  })

  return (
    <div className={cn("flex text-sm", className)} {...props}>
      {/* hour axis */}
      <div className="relative mr-4 w-14 shrink-0" style={{ height }}>
        {hours.map((h, i) =>
          i % labelEvery === 0 ? (
            <span
              key={h}
              className="absolute right-0 -translate-y-1/2 tabular-nums text-muted-foreground"
              style={{ top: y(h * 60) }}
            >
              {hourLabel(h)}
            </span>
          ) : null
        )}
      </div>

      {/* plot — narrow on purpose: time is the only axis */}
      <div className="relative w-24 shrink-0" style={{ height }}>
        {hours.map((h, i) => (
          <div
            key={h}
            aria-hidden="true"
            className={cn(
              "absolute inset-x-0 border-t",
              i % labelEvery === 0 ? "border-border" : "border-border/50"
            )}
            style={{ top: y(h * 60) }}
          />
        ))}

        {placed.map((e) => (
          <div
            key={e.id}
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ top: y(e.min) }}
            title={`${e.at} ${e.label}`}
          >
            <Mark category={e.category} surface={surface} />
          </div>
        ))}
      </div>

      {/* Leaders, drawn only for the labels that had to move. The elbow leaves
          the mark horizontally before it drops, so the eye picks up the thread
          at the mark rather than at an angle that could point anywhere. */}
      <svg
        width={LEADER}
        height={height}
        className="shrink-0"
        aria-hidden="true"
        focusable="false"
      >
        {labels.map((e) =>
          e.top - y(e.min) > 1 ? (
            <path
              key={e.id}
              d={`M0 ${y(e.min)} H${LEADER * 0.3} L${LEADER * 0.7} ${e.top} H${LEADER}`}
              fill="none"
              strokeWidth={1}
              // Muted ink rather than the border token: a leader is the thing
              // that resolves which mark a moved label belongs to, so it has to
              // stay visible on the pale surfaces where --border all but
              // disappears. Still recessive — it is a thread, not a mark.
              style={{ stroke: "var(--muted-foreground)", strokeOpacity: 0.45 }}
            />
          ) : null
        )}
      </svg>

      {/* The readable copy of the same data. It is what makes the marks legible
          to anyone the colours and shapes do not reach, and the only place the
          event names appear at all. */}
      <ol className="relative min-w-0 flex-1" style={{ height }}>
        {labels.map((e) => (
          <li
            key={e.id}
            className="absolute left-0 -translate-y-1/2 whitespace-nowrap"
            style={{ top: e.top }}
          >
            <div className="flex items-baseline gap-2">
              <span className="tabular-nums text-muted-foreground">{e.at}</span>
              <span className="font-medium">{e.label}</span>
            </div>
            {e.repeat && (
              <div className="text-xs text-muted-foreground">
                ×{e.repeat.count} until {e.repeat.until}
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}

export { DayTimeline }
