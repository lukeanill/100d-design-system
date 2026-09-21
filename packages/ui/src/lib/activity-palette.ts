/**
 * Fixed categorical colours for the activity views (DayActivity, DayTimeline).
 *
 * Deliberately NOT theme tokens. A category's colour is its identity — "meetings
 * are blue" has to hold while you flip between the eleven themes, or the colour
 * stops meaning anything. The theme's own `chart-1..5` tokens move with the
 * theme, which is right for a chart of one theme's data and wrong for this.
 *
 * These five slots are validated rather than chosen by eye, in both modes:
 *
 *            lightness band   chroma floor   CVD separation        normal vision
 *   light    PASS             PASS           PASS  ΔE 9.1          PASS  ΔE 19.6
 *   dark     PASS             PASS           PASS  ΔE 8.4          PASS  ΔE 19.3
 *
 * On a light surface three of them sit below 3:1 contrast, which obliges relief
 * — identity must never rest on colour alone. Both components carry it: every
 * mark has a text alternative naming the category and its count, so the colour
 * is a shortcut to information that is also written down.
 *
 * Assign in order, never cycled. A sixth category is not a generated hue — it
 * folds into `OTHER`, which is intentionally neutral so it reads as "the rest"
 * rather than as a sixth identity.
 */

export type ActivitySurface = "light" | "dark"

/** The five slots, in fixed assignment order. */
export const ACTIVITY_HUES = ["blue", "orange", "aqua", "yellow", "magenta"] as const

export type ActivityHue = (typeof ACTIVITY_HUES)[number]

/** Same five hues, stepped for each surface — not an automatic flip of one set. */
const STEPS: Record<ActivitySurface, Record<ActivityHue, string>> = {
  light: {
    blue: "#2a78d6",
    orange: "#eb6834",
    aqua: "#1baf7a",
    yellow: "#eda100",
    magenta: "#e87ba4",
  },
  dark: {
    blue: "#3987e5",
    orange: "#d95926",
    aqua: "#199e70",
    yellow: "#c98500",
    magenta: "#d55181",
  },
}

/** Everything past the fifth category. Neutral on purpose. */
const OTHER: Record<ActivitySurface, string> = {
  light: "#8a8a8e",
  dark: "#9a9a9e",
}

/**
 * The colour for the category at `index` in the assignment order.
 * Past the fifth, the neutral "other" step — never a generated hue.
 */
export function activityColor(index: number, surface: ActivitySurface = "light") {
  const hue = ACTIVITY_HUES[index]
  return hue ? STEPS[surface][hue] : OTHER[surface]
}

/** How many categories get a colour of their own before the rest fold together. */
export const ACTIVITY_SLOTS = ACTIVITY_HUES.length
