// Every theming option, in one place: its group, the name it has in the code block, what it does and
// what it accepts. The Design screen writes the code block from this list and reads it back, so a
// new option is one entry here. Descriptions use the words the Themer's own tiles use.

import {
  BACKGROUNDS,
  BODY_FONTS,
  CLICKS,
  HERO_HEADINGS,
  HERO_TEXTS,
  HEADING_FONTS,
  LINK_HOVERS,
  MATERIALS,
  MOTIONS,
  OVERLAYS,
  RADII,
  SHADOW_LEVELS,
  SCALES,
  SPACINGS,
  SPEEDS,
  TRANSITIONS,
  TRANSITION_COLORS,
  VALUE_QUESTIONS,
  isHex,
  normalizeHex,
  type ThemeDraft,
} from "@workspace/ui/themes"

/** The icon weights the Themer offers. */
export const ICON_CHOICES = ["thin", "light", "regular", "fill"] as const

type Field = Exclude<keyof ThemeDraft, "values"> | "values.0" | "values.1" | "values.2" | "values.3"

type Kind =
  | { type: "text" }
  | { type: "hex" }
  | { type: "font"; families: string[] }
  | { type: "weight" }
  | { type: "choice"; choices: readonly (string | number)[] }
  | { type: "toggle" }

export interface Option {
  /** What the line is called in the code block. */
  name: string
  field: Field
  description: string
  kind: Kind
}

export interface Group {
  title: string
  options: Option[]
}

const choice = (choices: readonly (string | number)[]): Kind => ({ type: "choice", choices })
const hex: Kind = { type: "hex" }

export const GROUPS: Group[] = [
  {
    title: "Name",
    options: [
      { name: "theme name", field: "label", kind: { type: "text" }, description: "The name of your theme. It also names the file you download." },
    ],
  },
  {
    title: "Color",
    options: [
      { name: "background", field: "background", kind: hex, description: "Background is used for the page behind everything. A dark one makes a dark theme." },
      { name: "foreground", field: "foreground", kind: hex, description: "Foreground is used for text, icons and outlines on the background." },
      { name: "primary", field: "primary", kind: hex, description: "Primary is used for the main button and for anything that should stand out." },
      { name: "secondary", field: "secondary", kind: hex, description: "Secondary is used for quieter buttons, chips and highlights." },
    ],
  },
  {
    title: "Typography",
    options: [
      { name: "heading primary font", field: "headingFont", kind: { type: "font", families: HEADING_FONTS.map((f) => f.family) }, description: "The main heading typeface, for titles and large text." },
      { name: "heading primary weight", field: "headingWeight", kind: { type: "weight" }, description: "How heavy primary headings are. A weight the font does not have snaps to the closest one it has." },
      { name: "heading secondary font", field: "headingSecondaryFont", kind: { type: "font", families: [...new Set([...HEADING_FONTS, ...BODY_FONTS].map((f) => f.family))] }, description: "The second heading typeface, for emphasis and accents in headings. Left empty it is the primary one." },
      { name: "heading secondary weight", field: "headingSecondaryWeight", kind: { type: "weight" }, description: "How heavy secondary headings are. Left empty it follows the primary weight." },
      { name: "body font", field: "bodyFont", kind: { type: "font", families: BODY_FONTS.map((f) => f.family) }, description: "The typeface for paragraphs, buttons and labels." },
      { name: "body weight", field: "bodyWeight", kind: { type: "weight" }, description: "How heavy body text is. A weight the font does not have snaps to the closest one it has." },
      { name: "type scale", field: "scale", kind: choice(SCALES), description: "How big text is overall: sm is compact, md is the design system's own sizes, lg is roomy." },
    ],
  },
  {
    title: "Texture",
    options: [
      { name: "texture", field: "material", kind: choice(MATERIALS), description: "What cards and panels are made of: flat colour, a soft gradient, or see-through glass." },
    ],
  },
  {
    title: "Radius",
    options: [
      { name: "radius", field: "radius", kind: choice(RADII), description: "How round corners are: sharp is square, rounded is a pill." },
    ],
  },
  {
    title: "Shadow",
    options: [
      { name: "shadow", field: "shadow", kind: choice(SHADOW_LEVELS), description: "How much cards and menus lift off the page." },
    ],
  },
  {
    title: "Spacing",
    options: [
      { name: "spacing", field: "spacing", kind: choice(SPACINGS), description: "The room between and inside things: sm is tight, lg is airy." },
    ],
  },
  {
    title: "Icons",
    options: [
      { name: "icons", field: "iconWeight", kind: choice(ICON_CHOICES), description: "How thick icon strokes are. fill is solid icons instead of outlines." },
    ],
  },
  {
    title: "Component Animations",
    options: [
      { name: "component animations", field: "motion", kind: choice(MOTIONS), description: "How buttons, menus and dialogs move: none is instant, ease glides slowly, emphatic is quick, springy bounces." },
    ],
  },
  {
    title: "Page Transitions",
    options: [
      { name: "page transition", field: "transition", kind: choice(TRANSITIONS), description: "The effect that covers a page change. none just swaps the page." },
      { name: "transition color", field: "transitionColor", kind: choice(TRANSITION_COLORS), description: "What colour the page transition is painted in. Only used when there is a page transition." },
      { name: "transition speed", field: "transitionSpeed", kind: choice(SPEEDS), description: "How long the page transition takes. Only used when there is a page transition." },
    ],
  },
  {
    title: "Animated Background",
    options: [
      { name: "animated background", field: "animatedBackground", kind: choice(BACKGROUNDS), description: "A moving picture behind the page. none is the plain background." },
      { name: "background theme colors", field: "animatedBackgroundThemeColors", kind: { type: "toggle" }, description: "Paint the animated background in your theme's colours. Left empty means no." },
      { name: "background inverse colors", field: "animatedBackgroundInverse", kind: { type: "toggle" }, description: "Swap the colours it is painted with. Left empty means no." },
      { name: "background overlay", field: "animatedBackgroundOverlay", kind: choice(OVERLAYS), description: "How strongly a dark scrim covers the animated background, in percent. Only used when there is an animated background." },
    ],
  },
  {
    title: "Hero Section",
    options: [
      { name: "hero heading", field: "heroHeading", kind: choice(HERO_HEADINGS), description: "An effect on the big heading at the top of a page." },
      { name: "hero text entry", field: "heroText", kind: choice(HERO_TEXTS), description: "How the text under the heading arrives on screen." },
      { name: "button click", field: "buttonClick", kind: choice(CLICKS), description: "The effect when a button is pressed." },
      { name: "link hover", field: "linkHover", kind: choice(LINK_HOVERS), description: "The effect when the pointer is over a link." },
    ],
  },
  {
    title: "Values",
    options: VALUE_QUESTIONS.map((q, i) => ({
      name: ["navigation", "decisions", "complexity", "voice"][i],
      field: `values.${i}` as Field,
      kind: choice([q.a.label.toLowerCase(), q.b.label.toLowerCase()]),
      description: `${q.question} ${q.a.label}: ${q.a.description} ${q.b.label}: ${q.b.description}`,
    })),
  },
]

export const OPTIONS = GROUPS.flatMap((g) => g.options)

/** What an option accepts, in a line. */
export function accepts(o: Option): string {
  const k = o.kind
  switch (k.type) {
    case "text":
      return "any text"
    case "hex":
      return "a hex colour, like #0b0b0b or #0b0"
    case "font":
      return `one of: ${k.families.join(", ")}`
    case "weight":
      return "a number from 100 to 900 in steps of 100, like 400"
    case "toggle":
      return "yes or no"
    case "choice":
      return `one of: ${k.choices.join(", ")}`
  }
}

/** The text spread over lines no longer than `width`, each wrapped as a comment. */
function comment(text: string, width = 74): string[] {
  const lines: string[] = []
  let line = ""
  for (const word of text.split(" ")) {
    if (line && (line + " " + word).length > width) {
      lines.push(line)
      line = word
    } else line = line ? line + " " + word : word
  }
  if (line) lines.push(line)
  return lines.map((l) => `/* ${l} */`)
}

/* --- reading and writing the draft ---------------------------------------------- */

export function read(d: ThemeDraft, field: Field): string {
  if (field.startsWith("values.")) {
    const i = Number(field.slice(7))
    const a = d.values[i]
    if (!a) return ""
    const q = VALUE_QUESTIONS[i]
    return (a === "a" ? q.a.label : q.b.label).toLowerCase()
  }
  const v = d[field as Exclude<Field, `values.${number}`>]
  if (v === undefined) return ""
  if (typeof v === "boolean") return v ? "yes" : "no"
  return String(v)
}

type Parsed = { ok: true; value: unknown } | { ok: false; error: string }

/** One typed value as the draft's own kind of value, or why it is not acceptable. */
export function parseValue(o: Option, raw: string): Parsed {
  const text = raw.trim()
  const k = o.kind
  switch (k.type) {
    case "text":
      return { ok: true, value: text }
    case "hex":
      return isHex(text) ? { ok: true, value: normalizeHex(text) } : { ok: false, error: `"${text}" is not a hex colour. Try something like #0b0b0b.` }
    case "font": {
      const hit = k.families.find((f) => f.toLowerCase() === text.toLowerCase())
      return hit ? { ok: true, value: hit } : { ok: false, error: `"${text}" is not one of the fonts for this option.` }
    }
    case "weight": {
      const n = Number(text)
      return Number.isInteger(n) && n >= 100 && n <= 900 && n % 100 === 0
        ? { ok: true, value: n }
        : { ok: false, error: `"${text}" is not a weight. Use 100, 200 ... 900.` }
    }
    case "toggle": {
      const t = text.toLowerCase()
      return t === "yes" || t === "no" ? { ok: true, value: t === "yes" } : { ok: false, error: `"${text}" is not yes or no.` }
    }
    case "choice": {
      const t = text.toLowerCase().replace(/%$/, "")
      const hit = k.choices.find((c) => String(c).toLowerCase() === t)
      return hit !== undefined ? { ok: true, value: hit } : { ok: false, error: `"${text}" is not one of: ${k.choices.join(", ")}.` }
    }
  }
}

function write(d: ThemeDraft, o: Option, value: unknown): ThemeDraft {
  if (o.field.startsWith("values.")) {
    const i = Number(o.field.slice(7))
    const q = VALUE_QUESTIONS[i]
    const answer = value === undefined ? undefined : value === q.a.label.toLowerCase() ? "a" : "b"
    return { ...d, values: d.values.map((v, j) => (j === i ? answer : v)) }
  }
  return { ...d, [o.field]: value }
}

/* --- the code block ------------------------------------------------------------- */

const HEADING_LINES = (title: string) => ["", "/*", title.toUpperCase().startsWith("SET") ? title.toUpperCase() : `SET YOUR ${title.toUpperCase()} CHOICES`, "*/"]

/** The draft as the code block: a heading per group, then each option's description, what it accepts, and its line. */
export function draftToText(d: ThemeDraft): string {
  const out: string[] = []
  GROUPS.forEach((g, gi) => {
    if (gi === 0) out.push("/* Name your theme */")
    else out.push(...HEADING_LINES(g.title))
    for (const o of g.options) {
      if (gi > 0 || o !== g.options[0]) {
        out.push(...comment(o.description))
        out.push(...comment(`Accepts: ${accepts(o)}`))
      }
      out.push(`${o.name}: ${o.field === "label" ? d.label : read(d, o.field)}`.trimEnd())
    }
  })
  return out.join("\n")
}

export interface LineError {
  /** 1-based line in the text. */
  line: number
  name: string
  message: string
}

const INSIDE = /^\s*\/\*.*\*\/\s*$/

/**
 * The text read back. Each option takes the value on its line; an empty line clears it. A line that
 * cannot be read says why and keeps the draft's last good value for that option.
 */
export function textToDraft(text: string, previous: ThemeDraft): { draft: ThemeDraft; errors: LineError[] } {
  let draft = previous
  const errors: LineError[] = []
  let inBlock = false
  const seen = new Set<string>()
  text.split("\n").forEach((line, i) => {
    if (inBlock) {
      if (line.includes("*/")) inBlock = false
      return
    }
    if (line.includes("/*") && !line.includes("*/")) {
      inBlock = true
      return
    }
    if (!line.trim() || INSIDE.test(line)) return
    const m = /^\s*([^:]+?)\s*:(.*)$/.exec(line)
    if (!m) {
      errors.push({ line: i + 1, name: line.trim(), message: "This line should look like  option: value." })
      return
    }
    const name = m[1].toLowerCase().replace(/\s+/g, " ")
    const option = OPTIONS.find((o) => o.name === name)
    if (!option) {
      errors.push({ line: i + 1, name, message: `"${m[1]}" is not a theming option.` })
      return
    }
    if (seen.has(name)) {
      errors.push({ line: i + 1, name, message: `${name} is set twice. The first one is used.` })
      return
    }
    seen.add(name)
    const raw = m[2].trim()
    if (!raw) {
      draft = write(draft, option, undefined)
      if (option.field === "label") draft = { ...draft, label: "" }
      return
    }
    const parsed = parseValue(option, raw)
    if (parsed.ok) draft = write(draft, option, parsed.value)
    else errors.push({ line: i + 1, name, message: parsed.error })
  })
  return { draft, errors }
}
