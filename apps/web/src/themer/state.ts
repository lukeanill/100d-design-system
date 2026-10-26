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
  type ThemeValues,
} from "@workspace/ui/themes"

export type Step = "landing" | "copy" | "language" | "mytheme" | "code"
export type Tab = "look" | "values"

export const BASELINE = getPreset("berghain")!

export const emptyDraft = (): ThemeDraft => ({ label: "", values: [undefined, undefined, undefined, undefined] })

/** A preset, opened as a draft: every value is set and can be changed. */
export function draftFromPreset(theme: Theme): ThemeDraft {
  return {
    label: "",
    background: theme.palette.background,
    primary: theme.palette.primary,
    secondary: theme.palette.secondary,
    headingFont: theme.fonts.display.family,
    headingWeight: theme.fonts.display.weight,
    bodyFont: theme.fonts.body.family,
    bodyWeight: theme.fonts.body.weight,
    material: theme.material,
    radius: theme.radius,
    elevation: theme.elevation,
    spacing: theme.spacing,
    iconStyle: theme.icons.style,
    iconWeight: theme.icons.weight,
    values: [...theme.values],
  }
}

const LOOK_KEYS = [
  "background", "primary", "secondary", "headingFont", "headingWeight", "bodyFont", "bodyWeight",
  "material", "radius", "elevation", "spacing", "iconStyle", "iconWeight",
] as const satisfies readonly (keyof ThemeDraft)[]

/** The Look values still empty. */
export const unsetLook = (d: ThemeDraft) => LOOK_KEYS.filter((k) => d[k] === undefined)
export const lookDone = (d: ThemeDraft) => unsetLook(d).length === 0
export const valuesDone = (d: ThemeDraft) => d.values.every(Boolean)

/** A colour field that holds text that is not a colour. */
export const badColors = (d: ThemeDraft) =>
  (["background", "primary", "secondary"] as const).filter((k) => d[k] !== undefined && !isHex(d[k]!))

/** Names for the empty values, as the file's header lists them. */
const LABELS: Record<(typeof LOOK_KEYS)[number], string> = {
  background: "background", primary: "primary", secondary: "secondary", headingFont: "heading font",
  headingWeight: "heading weight", bodyFont: "body font", bodyWeight: "body weight", material: "surfaces",
  radius: "edges", elevation: "shadows", spacing: "spacing", iconStyle: "icon style", iconWeight: "icon weight",
}
export const unsetLabels = (d: ThemeDraft) => {
  const labels = unsetLook(d).map((k) => LABELS[k])
  // a font and its weight are one choice to the person making it
  return [...new Set(labels.map((l) => l.replace(/ weight$/, "")))]
}

const mix = (a: string, b: string, pct: number) => `color-mix(in oklab, ${a}, ${b} ${pct}%)`

/**
 * A draft as a complete theme. Whatever is empty falls back to the baseline,
 * which is why a theme built from scratch is never missing a token.
 */
export function draftToTheme(d: ThemeDraft): Theme {
  const base = BASELINE
  const hex = (v: string | undefined, fallback: string) => (v && isHex(v) ? normalizeHex(v) : fallback)
  const bg = hex(d.background, base.palette.background)
  const primary = hex(d.primary, base.palette.primary)
  const secondary = hex(d.secondary, base.palette.secondary)
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
      foreground: d.background ? fg : base.palette.foreground,
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
    spacing: d.spacing ?? base.spacing,
    radius: d.radius ?? base.radius,
    elevation: d.elevation ?? base.elevation,
    material: d.material ?? base.material,
    motion: base.motion,
    icons: { style: d.iconStyle ?? base.icons.style, weight: d.iconWeight ?? base.icons.weight },
    values: d.values.map((v, i) => v ?? DEFAULT_VALUES[i]) as ThemeValues,
  }
}

/** What the preview card looks like before anything is chosen: the Figma card, as drawn. */
export const FIGMA_CARD: Record<string, string> = {
  "--background": "#fcf9f8",
  "--foreground": "rgba(0,0,0,0.99)",
  "--card": "rgba(255,255,255,0.99)",
  "--primary": "#9c2f2f",
  "--primary-foreground": "#ffffff",
  "--secondary": "#dbdbdb",
  "--secondary-foreground": "#9c2f2f",
  "--muted-foreground": "rgba(0,0,0,0.75)",
  "--border": "rgba(0,0,0,0.1)",
  "--radius": "1rem",
  "--shadow-md": "none",
  "--font-primary": "'Migra', Georgia, serif",
  "--font-body-token": "'Karla', ui-sans-serif, system-ui, sans-serif",
  "--font-body-weight": "400",
  "--display-weight": "200",
  "--card-space": "1",
}

/**
 * The preview card's variables: the Figma card, with only the values that have
 * been chosen laid over it. Nothing from any preset is applied by default.
 */
export function previewStyle(d: ThemeDraft): Record<string, string> {
  const style: Record<string, string> = { ...FIGMA_CARD }
  const full = themeStyle(draftToTheme(d))
  const take = (...names: string[]) => names.forEach((n) => full[n] !== undefined && (style[n] = full[n]))

  if (d.background && isHex(d.background)) {
    take("--background", "--foreground", "--muted-foreground", "--border", "--input")
    style["--card"] = mix(full["--background"], full["--foreground"], 4)
    style["--background-card-contrast"] = "1"
  }
  if (d.primary && isHex(d.primary)) take("--primary", "--primary-foreground")
  if (d.secondary && isHex(d.secondary)) take("--secondary", "--secondary-foreground")
  if (d.headingFont) {
    take("--font-primary")
    style["--display-weight"] = String(draftToTheme(d).fonts.display.weight)
  }
  if (d.bodyFont) take("--font-body-token", "--font-body-weight")
  if (d.radius) take("--radius")
  if (d.elevation) take("--shadow-md")
  if (d.spacing) style["--card-space"] = d.spacing === "lg" ? "1.25" : "1"
  if (d.material) style["--card-material"] = d.material
  return style
}

export const PRESET_LIST = presets
