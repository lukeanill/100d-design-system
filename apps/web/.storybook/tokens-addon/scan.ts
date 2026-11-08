// Finds the design tokens a rendered component uses, by reading the styles that apply to it.
// For every element under the roots it takes each style rule that matches the element, and notes every
// `var(--token)` in the rule. That is exact for what the styles reference, but it cannot tell which of two
// competing rules wins, and it only sees the states that are showing (hover and focus count while active).

import { figmaVariableFor } from "@workspace/ui/themes"
import type { Theme } from "@workspace/ui/themes"

export interface TokenUse {
  /** The code token, for example `--primary`. */
  token: string
  group: string
  /** The computed value in the current theme. */
  value: string
  /** The Figma variable and the mode the theme uses, or null when there is none. */
  figma: { variable: string; mode: string } | null
  /** What styled with it: CSS properties, in plain words. */
  properties: string[]
  /** Which parts of the component use it. */
  parts: string[]
}

interface Rule {
  selector: string
  css: string
}

const GROUPS: [string, RegExp][] = [
  ["Colour", /^(background|foreground|card|card-foreground|popover|popover-foreground|primary|primary-foreground|secondary|secondary-foreground|muted|muted-foreground|accent|accent-foreground|destructive|affirmative|affirmative-foreground|focus|border|input|ring|chart-\d|sidebar.*|primitive-\d+)$/],
  ["Typography", /^(font-.*|text-.*|typescale-.*|h\d-.*|.*-line-height)$/],
  ["Radius", /^(radius.*|dimensions-max)$/],
  ["Shadow", /^shadow.*$/],
  ["Motion", /^(ease-.*|duration-.*|spring-.*|motion-.*)$/],
  ["Surface", /^(card-image|glass-.*|control-.*|gradient-.*|alpha-.*)$/],
]
// framework variables that are not design tokens
const IGNORED = /^(tw-|default-|spacing$|container-|animate-|tracking-|leading-|blur-|perspective|aspect-|inset-|breakpoint-)/

const PROPERTY_WORDS: Record<string, string> = {
  "background-color": "background", background: "background", "background-image": "background image",
  color: "text colour", "border-color": "border", border: "border", "border-top-color": "border", "border-bottom-color": "border",
  "border-left-color": "border", "border-right-color": "border", "outline-color": "outline", fill: "icon fill", stroke: "icon stroke",
  "box-shadow": "shadow", "font-family": "font", "font-size": "text size", "font-weight": "text weight", "line-height": "line height",
  "letter-spacing": "character spacing", "border-radius": "corner radius", "border-top-left-radius": "corner radius",
  "border-top-right-radius": "corner radius", "border-bottom-left-radius": "corner radius", "border-bottom-right-radius": "corner radius",
  "transition-duration": "motion", "transition-timing-function": "motion", "transition": "motion", "animation-duration": "motion",
  "--tw-ring-color": "focus ring", "--tw-shadow-color": "shadow colour", "--tw-gradient-from": "gradient", "--tw-gradient-via": "gradient",
  "--tw-gradient-to": "gradient", "--tw-ring-offset-color": "focus ring", "--tw-outline-color": "outline",
}

const normalise = (name: string): string | null => {
  if (IGNORED.test(name)) return null
  // framework colour aliases point at the design token of the same name
  if (name.startsWith("color-")) return name.slice("color-".length)
  return name
}

const groupOf = (token: string) => GROUPS.find(([, re]) => re.test(token))?.[0] ?? "Other"

// base rules that apply to every element or the page itself (a border colour on `*`, say) are not the component's own
const BASE_SELECTOR = /^(\*|html|body|:root|:host)(::?[\w-]+)?$|^::?[\w-]+$/

function componentSelectors(selectorText: string): string {
  return selectorText
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s && !BASE_SELECTOR.test(s))
    .join(", ")
}

function collectRules(): Rule[] {
  const out: Rule[] = []
  const walk = (rules: CSSRuleList) => {
    for (const rule of Array.from(rules)) {
      if (rule instanceof CSSStyleRule) {
        const selector = componentSelectors(rule.selectorText)
        if (selector && rule.cssText.includes("var(--")) out.push({ selector, css: rule.style.cssText })
      } else if (rule instanceof CSSMediaRule) {
        if (window.matchMedia(rule.conditionText).matches) walk(rule.cssRules)
      } else if ("cssRules" in rule && !(rule instanceof CSSFontFaceRule) && !(rule instanceof CSSKeyframesRule)) {
        walk((rule as CSSGroupingRule).cssRules)
      }
    }
  }
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      walk(sheet.cssRules)
    } catch {
      // a cross-origin stylesheet (for example the font stylesheet) cannot be read
    }
  }
  return out
}

const partName = (el: Element) => {
  const slot = el.getAttribute("data-slot")
  if (slot) return slot
  const tag = el.tagName.toLowerCase()
  const role = el.getAttribute("role")
  return role ? `${tag}[${role}]` : tag
}

export function scanTokens(roots: Element[], theme: Theme): TokenUse[] {
  const rules = collectRules()
  const rootStyle = getComputedStyle(document.documentElement)
  const uses = new Map<string, { properties: Set<string>; parts: Set<string> }>()

  const elements = roots.flatMap((r) => [r, ...Array.from(r.querySelectorAll("*"))])
  for (const el of elements) {
    if (["SCRIPT", "STYLE", "LINK"].includes(el.tagName)) continue
    for (const rule of rules) {
      let hit = false
      try {
        hit = el.matches(rule.selector)
      } catch {
        hit = false
      }
      if (!hit) continue
      for (const m of rule.css.matchAll(/([\w-]+)\s*:\s*([^;]+)(?:;|$)/g)) {
        const [, property, value] = m
        for (const ref of value.matchAll(/var\(\s*--([\w-]+)/g)) {
          const token = normalise(ref[1])
          if (!token) continue
          const entry = uses.get(token) ?? { properties: new Set<string>(), parts: new Set<string>() }
          const word = PROPERTY_WORDS[property]
          if (word) entry.properties.add(word)
          entry.parts.add(partName(el))
          uses.set(token, entry)
        }
      }
    }
  }

  const result: TokenUse[] = []
  for (const [token, entry] of uses) {
    const value = rootStyle.getPropertyValue(`--${token}`).trim()
    // a variable the theme does not define is not one of ours (a framework default, say)
    if (!value) continue
    result.push({
      token: `--${token}`,
      group: groupOf(token),
      value,
      figma: figmaVariableFor(token, theme),
      properties: [...entry.properties].sort(),
      parts: [...entry.parts].sort(),
    })
  }
  const order = ["Colour", "Typography", "Radius", "Shadow", "Motion", "Surface", "Other"]
  return result.sort((a, b) => order.indexOf(a.group) - order.indexOf(b.group) || a.token.localeCompare(b.token))
}
