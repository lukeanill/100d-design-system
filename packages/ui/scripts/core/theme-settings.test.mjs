// The settings a theme carries beyond colour and fonts.
//
// Two properties matter more than any single case: a theme that chose nothing
// stores nothing (so the themes that predate these settings never churn), and
// nothing reaches a stylesheet unchecked (the hosted studio writes to the repo
// from a web request).
//
//   node --test packages/ui/scripts/core/

import { strict as assert } from "node:assert"
import test from "node:test"

import {
  glassDeclarations,
  headingGradientDeclarations,
  normalizeEffects,
  normalizeGlass,
  normalizeTypography,
  typographyDeclarations,
} from "./theme-settings.mjs"

test("a theme that chose nothing stores nothing", () => {
  assert.equal(normalizeGlass(undefined), undefined)
  assert.equal(normalizeGlass({ style: "solid", weight: "heavy" }), undefined, "solid keeps no glass settings")
  assert.equal(normalizeTypography({ scale: "current" }), undefined)
  assert.equal(normalizeTypography({ headings: { h1: { font: "primary", weight: 400 } } }), undefined)
  assert.equal(normalizeEffects({ pageTransition: "none", background: "none" }), undefined)
})

test("an unknown value falls back to the default rather than throwing", () => {
  const glass = normalizeGlass({ style: "glass", weight: "extreme", tone: "rainbow", applications: ["actions", "nope"] })
  assert.equal(glass.weight, "medium")
  assert.equal(glass.tone, "light")
  assert.deepEqual(glass.applications, ["actions"], "unknown groups are dropped")

  assert.equal(normalizeTypography({ scale: "gigantic" }), undefined)
  const headings = normalizeTypography({ headings: { h1: { font: "handwriting", weight: 999 } } })
  assert.equal(headings, undefined, "an unknown font and weight land back on the defaults")

  assert.equal(normalizeEffects({ pageTransition: "explode" }), undefined)
})

test("gradient stops must be tokens the theme actually carries", () => {
  const tokens = { "accent-foreground": "oklch(1 0 0)", primary: "oklch(0.5 0 0)" }
  const chosen = normalizeEffects(
    { headingGradient: { enabled: true, from: "primary", to: "accent-foreground" } },
    tokens
  )
  assert.deepEqual(chosen.headingGradient, { enabled: true, from: "primary", to: "accent-foreground" })

  const injected = normalizeEffects(
    { headingGradient: { enabled: true, from: "red); } body { display: none", to: "nonexistent-token" } },
    tokens
  )
  assert.equal(injected.headingGradient.from, "accent-foreground", "anything else falls back to the default")
  assert.equal(injected.headingGradient.to, "muted-foreground")
})

test("glass always covers cards, and only the groups that were ticked", () => {
  const lines = glassDeclarations({ style: "glass", weight: "heavy", tone: "dark", applications: ["actions"] })
  assert.ok(lines.some((l) => l.startsWith("--glass-card-layer")), "cards are always glass")
  assert.ok(lines.some((l) => l.startsWith("--glass-action-blur: 64px")), "the ticked group takes the theme's weight")
  assert.ok(!lines.some((l) => l.startsWith("--glass-select-")), "an unticked group is left as it is")
  assert.ok(lines.some((l) => l.includes("oklch(0 0 0)")), "a dark tone tints toward black")
})

test("medium glass is the recipe the menus already use", () => {
  const lines = glassDeclarations({ style: "glass", weight: "medium", tone: "light", applications: ["selects"] })
  assert.ok(lines.includes("--glass-select-blur: 40px;"))
  assert.ok(lines.includes("--glass-select-saturate: 150%;"))
})

test("only the headings that changed are written", () => {
  const lines = typographyDeclarations({
    scale: "compact",
    headings: { h2: { font: "emphasis" }, h3: { font: "primary", weight: 700 } },
  })
  assert.ok(lines.includes("--h1-size: 3.75rem;"), "a scale sets every level")
  assert.ok(lines.includes("--h2-family: var(--font-oranienbaum);"))
  assert.ok(!lines.some((l) => l.startsWith("--h2-weight")), "a level left at 400 sets no weight")
  assert.ok(lines.includes("--h3-weight: 700;"))
  assert.ok(!lines.some((l) => l.startsWith("--h3-family")), "primary is the default and sets no family")
})

test("the current scale and an untouched heading emit nothing", () => {
  assert.deepEqual(typographyDeclarations({ scale: "current" }), [])
  assert.deepEqual(typographyDeclarations(undefined), [])
  assert.deepEqual(glassDeclarations(undefined), [])
  assert.deepEqual(headingGradientDeclarations(undefined), [])
})

test("the H1 gradient is drawn from the theme's own tokens", () => {
  const tokens = { primary: "oklch(0.5 0 0)", "muted-foreground": "oklch(0.7 0 0)" }
  const lines = headingGradientDeclarations(
    { headingGradient: { enabled: true, from: "primary", to: "muted-foreground" } },
    tokens
  )
  assert.ok(lines[0].includes("var(--primary) 0%"))
  assert.ok(lines[0].includes("var(--muted-foreground) 20%"))
  assert.ok(lines.includes("--h1-gradient-clip: text;"))
})
