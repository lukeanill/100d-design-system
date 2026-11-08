// The Figma `ui-color` collection: the status colours (destructive, affirmative, focus) and the five chart
// series, in three modes. Each theme names one through its `ui-color` setting (`Theme.uiColor`).

export const UI_COLOR_MODES = ["classic", "modern", "alternative"] as const
export type UiColor = (typeof UI_COLOR_MODES)[number]

export interface UiColorSet {
  destructive: string
  affirmative: string
  focus: string
  charts: [string, string, string, string, string]
}

export const UI_COLORS: Record<UiColor, UiColorSet> = {
  classic: {
    destructive: "#e7000b", affirmative: "#00a81c", focus: "#0032a8",
    charts: ["#1447e6", "#00bc7d", "#fe9a00", "#ad46ff", "#ff2056"],
  },
  modern: {
    destructive: "#ff6467", affirmative: "#64ff9f", focus: "#ac64ff",
    charts: ["#f54900", "#009689", "#104e64", "#ffb900", "#955e09"],
  },
  alternative: {
    destructive: "#eb7a50", affirmative: "#a5eb50", focus: "#50ebd1",
    charts: ["#db50eb", "#ebc950", "#50cceb", "#5086eb", "#a850eb"],
  },
}
