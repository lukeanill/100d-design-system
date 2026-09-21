import { DayActivity } from "./day-activity"
import type { ActivityDatum } from "./day-activity"

const CATEGORIES: ActivityDatum[] = [
  { id: "meetings", label: "meetings", count: 3 },
  { id: "deliveries", label: "deliveries", count: 5 },
  { id: "alerts", label: "alerts", count: 1 },
  { id: "checks", label: "checks", count: 4 },
  { id: "notes", label: "notes", count: 2 },
]

export default {
  title: "Components/Data/Day activity",
  component: DayActivity,
  argTypes: {
    surface: { control: "inline-radio", options: ["light", "dark"] },
    scale: { control: "inline-radio", options: ["sqrt", "linear"] },
    height: { control: { type: "number", min: 6, max: 40 } },
    barWidth: { control: { type: "number", min: 2, max: 8 } },
    gap: { control: { type: "number", min: 1, max: 6 } },
    max: { control: { type: "number", min: 1, max: 20 } },
    data: { table: { disable: true } },
  },
  args: { data: CATEGORIES, surface: "light", height: 12, barWidth: 3, gap: 2, scale: "sqrt" },
}

export const Default = {}

/** One event in a category still gets a visible bar rather than a sliver. */
export const Sparse = {
  args: { data: [{ id: "alerts", label: "alerts", count: 1 }] },
}

/** Past the fifth category the rest share a neutral step instead of a sixth hue. */
export const BeyondTheSlots = {
  args: {
    data: [
      ...CATEGORIES,
      { id: "misc", label: "misc", count: 2 },
      { id: "other", label: "other", count: 1 },
    ],
  },
}

export const NoActivity = {
  args: { data: [] },
}

/**
 * A week of cells. `max` is shared across all of them — scaled to its own
 * maximum, every day would look equally busy and the comparison the row exists
 * to support would be lost. Thursday is the busy one, and it should look it.
 */
export const InCalendarCells = {
  render: (args: { surface: "light" | "dark"; scale: "sqrt" | "linear" }) => {
    const week = [
      { day: "Mon", n: [1, 2, 0, 1, 0] },
      { day: "Tue", n: [2, 1, 0, 0, 1] },
      { day: "Wed", n: [0, 0, 0, 0, 0] },
      { day: "Thu", n: [6, 9, 3, 7, 4] },
      { day: "Fri", n: [3, 2, 1, 0, 2] },
      { day: "Sat", n: [1, 3, 2, 4, 1] },
      { day: "Sun", n: [0, 1, 0, 0, 0] },
    ]
    const shared = Math.max(...week.flatMap((d) => d.n))
    return (
      <div className="flex gap-1">
        {week.map(({ day, n }, i) => (
          <div
            key={day}
            className="flex w-14 flex-col items-center gap-1 rounded-md border border-border p-2"
          >
            <span className="text-xs text-muted-foreground">{day}</span>
            <span className="text-lg font-semibold tabular-nums">{i + 2}</span>
            <DayActivity
              surface={args.surface}
              scale={args.scale}
              max={shared}
              data={CATEGORIES.map((c, j) => ({ ...c, count: n[j] ?? 0 }))}
            />
          </div>
        ))}
      </div>
    )
  },
}
