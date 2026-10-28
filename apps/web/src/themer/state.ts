import {
  DEFAULT_VALUES,
  getPreset,
  isHex,
  nearestWeight,
  normalizeHex,
  onColor,
  presets,
  slugify,
  themeStyle,
  type Theme,
  type ThemeDraft,
  type ThemeFeel,
  type ThemeValues,
} from "@workspace/ui/themes"

export type Step = "landing" | "copy" | "language" | "mytheme" | "code"
export type Tab = "look" | "feel" | "values"

export const BASELINE = getPreset("berghain")!

export const emptyDraft = (): ThemeDraft => ({ label: "", values: [undefined, undefined, undefined, undefined] })

/** A preset, opened as a draft: every value is set and can be changed. */
export function draftFromPreset(theme: Theme): ThemeDraft {
  return {
    label: "",
    background: theme.palette.background,
    foreground: theme.palette.foreground,
    primary: theme.palette.primary,
    secondary: theme.palette.secondary,
    headingFont: theme.fonts.display.family,
    headingWeight: theme.fonts.display.weight,
    bodyFont: theme.fonts.body.family,
    bodyWeight: theme.fonts.body.weight,
    scale: theme.scale,
    material: theme.material,
    tone: theme.tone,
    radius: theme.radius,
    elevation: theme.elevation,
    spacing: theme.spacing,
    iconStyle: theme.icons.style,
    iconWeight: theme.icons.weight,
    motion: theme.motion,
    ...theme.feel,
    values: [...theme.values],
  }
}

const LOOK_KEYS = [
  "background", "foreground", "primary", "secondary", "headingFont", "headingWeight", "bodyFont", "bodyWeight",
  "scale", "material", "tone", "radius", "elevation", "spacing", "iconWeight",
] as const satisfies readonly (keyof ThemeDraft)[]

/** The Look values still empty. */
export const unsetLook = (d: ThemeDraft) => LOOK_KEYS.filter((k) => d[k] === undefined)
export const valuesDone = (d: ThemeDraft) => d.values.every(Boolean)

/** A colour field that holds text that is not a colour. */
export const badColors = (d: ThemeDraft) =>
  (["background", "foreground", "primary", "secondary"] as const).filter((k) => d[k] !== undefined && !isHex(d[k]!))

/** Names for the empty values, as the file's header lists them. */
const LABELS: Record<(typeof LOOK_KEYS)[number], string> = {
  background: "background", foreground: "foreground", primary: "primary", secondary: "secondary", headingFont: "heading font",
  headingWeight: "heading weight", bodyFont: "body font", bodyWeight: "body weight", scale: "type scale", material: "texture", tone: "texture tone",
  radius: "edges", elevation: "shadows", spacing: "spacing", iconWeight: "icons",
}
export const unsetLabels = (d: ThemeDraft) => {
  const labels = unsetLook(d).map((k) => LABELS[k])
  // a font and its weight are one choice to the person making it
  return [...new Set(labels.map((l) => l.replace(/ weight$/, "")))]
}

/** What the Look page still needs before it can be left: the theme's name and every choice. */
export const lookMissing = (d: ThemeDraft) => [...(d.label.trim() ? [] : ["theme name"]), ...unsetLabels(d)]
export const lookDone = (d: ThemeDraft) => lookMissing(d).length === 0

/* --- Feel ------------------------------------------------------------------- */

const FEEL_KEYS = [
  "transition", "transitionColor", "transitionSpeed", "animatedBackground", "animatedBackgroundThemeColors",
  "animatedBackgroundInverse", "animatedBackgroundOverlay", "heroHeading", "heroText", "buttonClick", "linkHover",
] as const satisfies readonly (keyof ThemeFeel)[]

/**
 * What the Feel page still needs. Every question wants an answer ("none" is one); a transition's
 * colour and speed and a background's overlay are only asked once there is a transition or a
 * background. The two toggles are answered by being left off.
 */
export function feelMissing(d: ThemeDraft): string[] {
  const missing: string[] = []
  if (d.motion === undefined) missing.push("component animations")
  if (d.transition === undefined) missing.push("page transition")
  else if (d.transition !== "none") {
    if (d.transitionColor === undefined) missing.push("transition color")
    if (d.transitionSpeed === undefined) missing.push("transition speed")
  }
  if (d.animatedBackground === undefined) missing.push("animated background")
  else if (d.animatedBackground !== "none" && d.animatedBackgroundOverlay === undefined) missing.push("background overlay")
  if (d.heroHeading === undefined) missing.push("hero heading")
  if (d.heroText === undefined) missing.push("hero text entry")
  if (d.buttonClick === undefined) missing.push("button click")
  if (d.linkHover === undefined) missing.push("link hover")
  return missing
}
export const feelDone = (d: ThemeDraft) => feelMissing(d).length === 0

/** What the Values page still needs: an answer to every question. */
export const valuesMissing = (d: ThemeDraft) => d.values.flatMap((v, i) => (v ? [] : [`question ${i + 1}`]))

/**
 * A draft as a complete theme. Whatever is empty falls back to the baseline,
 * which is why a theme built from scratch is never missing a token.
 */
export function draftToTheme(d: ThemeDraft, base: Theme = BASELINE): Theme {
  const hex = (v: string | undefined, fallback: string) => (v && isHex(v) ? normalizeHex(v) : fallback)
  const bg = hex(d.background, base.palette.background)
  const primary = hex(d.primary, base.palette.primary)
  const secondary = hex(d.secondary, base.palette.secondary)
  const chosenFg = d.foreground && isHex(d.foreground) ? normalizeHex(d.foreground) : undefined
  const heading = d.headingFont ?? base.fonts.display.family
  const body = d.bodyFont ?? base.fonts.body.family
  const fg = onColor(bg)
  const dark = fg === "#ffffff"
  const scheme = d.background ? (dark ? "dark" : "light") : base.scheme
  return {
    id: slugify(d.label),
    label: d.label.trim() || "My theme",
    scheme,
    palette: {
      background: bg,
      foreground: chosenFg ?? (d.background ? fg : base.palette.foreground),
      primary,
      primaryForeground: d.primary ? onColor(primary) : base.palette.primaryForeground,
      secondary,
      secondaryForeground: d.secondary ? onColor(secondary) : base.palette.secondaryForeground,
      destructive: scheme === "dark" ? "#ff6467" : "#e7000b",
      charts: base.palette.charts,
    },
    fonts: {
      display: { family: heading, weight: nearestWeight(heading, d.headingWeight ?? base.fonts.display.weight) },
      body: { family: body, weight: nearestWeight(body, d.bodyWeight ?? base.fonts.body.weight) },
      serif: base.fonts.serif,
    },
    scale: d.scale ?? base.scale,
    spacing: d.spacing ?? base.spacing,
    radius: d.radius ?? base.radius,
    elevation: d.elevation ?? base.elevation,
    material: d.material ?? base.material,
    tone: d.tone ?? base.tone,
    motion: d.motion ?? base.motion,
    feel: { ...base.feel, ...Object.fromEntries(FEEL_KEYS.flatMap((k) => (d[k] === undefined ? [] : [[k, d[k]]]))) } as ThemeFeel,
    icons: { style: d.iconStyle ?? base.icons.style, weight: d.iconWeight ?? base.icons.weight },
    values: d.values.map((v, i) => v ?? DEFAULT_VALUES[i]) as ThemeValues,
  }
}

export const PRESET_LIST = presets

/** The look the product preview starts from, drawn from the Figma's "Coeurdes Alpes" page. */
export const ALPES: Theme = {
  ...BASELINE,
  id: "alpes",
  label: "Alpes",
  scheme: "light",
  palette: {
    background: "#fcf9f8",
    foreground: "#000000",
    primary: "#9c2f2f",
    primaryForeground: "#ffffff",
    secondary: "#dbdbdb",
    secondaryForeground: "#9c2f2f",
    destructive: "#e7000b",
    charts: BASELINE.palette.charts,
  },
  fonts: { display: { family: "Migra", weight: 200 }, body: { family: "Karla", weight: 400 }, serif: BASELINE.fonts.serif },
  scale: "md",
  spacing: "md",
  radius: "strong",
  elevation: "none",
  material: "solid",
  // the Figma's Page Product card is a step lighter than its cream page
  tone: "light",
}

/**
 * Every token the design system's components read, for the product preview:
 * the Alpes look with only the values that have been chosen laid over it.
 */
export const productStyle = (d: ThemeDraft): Record<string, string> => themeStyle(draftToTheme(d, ALPES))
