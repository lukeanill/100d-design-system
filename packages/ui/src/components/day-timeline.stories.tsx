import { DayTimeline } from "./day-timeline"
import type { TimelineEvent } from "./day-timeline"

const EVENTS: TimelineEvent[] = [
  { id: "1", at: "08:36", label: "D/Bell", category: 1 },
  { id: "2", at: "10:55", label: "D/Bell", category: 1, repeat: { count: 4, until: "11:04" } },
  { id: "3", at: "11:20", label: "Motion", category: 0 },
  { id: "4", at: "11:37", label: "D/Bell", category: 1, repeat: { count: 2, until: "11:38" } },
  { id: "5", at: "11:38", label: "D/Bell off", category: 2 },
  { id: "6", at: "15:10", label: "Package", category: 3 },
]

export default {
  title: "Components/Data/Day timeline",
  component: DayTimeline,
  argTypes: {
    from: { control: { type: "number", min: 0, max: 23 } },
    to: { control: { type: "number", min: 1, max: 24 } },
    labelEvery: { control: { type: "number", min: 1, max: 4 } },
    surface: { control: "inline-radio", options: ["light", "dark"] },
    events: { table: { disable: true } },
  },
  args: { events: EVENTS, from: 8, to: 18, labelEvery: 2, surface: "light" },
}

export const Default = {}

/** A rule on every hour and a label on every hour — densest the axis gets. */
export const LabelEveryHour = {
  args: { labelEvery: 1, from: 8, to: 14 },
}

/** A full day compresses the rules; labels stay every fourth so they can breathe. */
export const FullDay = {
  args: { from: 0, to: 24, labelEvery: 4 },
}

/** Events clustered inside one hour — what the rules have to resolve. */
export const Clustered = {
  args: {
    from: 10,
    to: 13,
    labelEvery: 1,
    events: [
      { id: "a", at: "10:55", label: "D/Bell", category: 1 },
      { id: "b", at: "11:02", label: "D/Bell", category: 1 },
      { id: "c", at: "11:04", label: "Motion", category: 0 },
      { id: "d", at: "11:37", label: "D/Bell", category: 1 },
      { id: "e", at: "11:38", label: "D/Bell off", category: 2 },
    ] satisfies TimelineEvent[],
  },
}

export const Empty = {
  args: { events: [] },
}
