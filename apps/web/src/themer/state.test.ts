import { describe, expect, it } from "vitest"

import { getPreset } from "@workspace/ui/themes"

import { BASELINE, FIGMA_CARD, badColors, draftFromPreset, draftToTheme, emptyDraft, lookDone, previewStyle, unsetLabels, valuesDone } from "./state"

describe("a theme built from scratch", () => {
  it("shows the Figma card untouched: no preset is applied by default", () => {
    expect(previewStyle(emptyDraft())).toEqual(FIGMA_CARD)
  })

  it("starts empty, so nothing counts as done", () => {
    const d = emptyDraft()
    expect(lookDone(d)).toBe(false)
    expect(valuesDone(d)).toBe(false)
    expect(unsetLabels(d)).toContain("background")
  })

  it("lays each choice over the card as it is made, and only that choice", () => {
    const style = previewStyle({ ...emptyDraft(), primary: "#0000ff" })
    expect(style["--primary"]).not.toBe(FIGMA_CARD["--primary"])
    expect(style["--background"]).toBe(FIGMA_CARD["--background"])
  })

  it("derives readable foregrounds from a chosen background", () => {
    const dark = previewStyle({ ...emptyDraft(), background: "#101820" })
    const light = previewStyle({ ...emptyDraft(), background: "#f5f0e6" })
    expect(dark["--foreground"]).not.toBe(light["--foreground"])
  })

  it("fills what is empty from Berghain when a file is made", () => {
    const theme = draftToTheme({ ...emptyDraft(), primary: "#336699" })
    expect(theme.palette.background).toBe(BASELINE.palette.background)
    expect(theme.radius).toBe(BASELINE.radius)
    expect(theme.id).toBe("my-theme")
    expect(theme.values).toEqual(["a", "a", "a", "a"])
  })

  it("takes light or dark from the colour chosen, not from a preset", () => {
    expect(draftToTheme({ ...emptyDraft(), background: "#fafafa" }).scheme).toBe("light")
    expect(draftToTheme({ ...emptyDraft(), background: "#111111" }).scheme).toBe("dark")
  })

  it("never turns text that is not a colour into a token", () => {
    const theme = draftToTheme({ ...emptyDraft(), background: "zzz" })
    expect(theme.palette.background).toBe(BASELINE.palette.background)
    expect(badColors({ ...emptyDraft(), background: "zzz", primary: "#fff" })).toEqual(["background"])
  })

  it("names the theme from what was typed", () => {
    expect(draftToTheme({ ...emptyDraft(), label: "Alpine Dusk" }).id).toBe("alpine-dusk")
  })
})

describe("copying a preset", () => {
  it("opens every value, so Look is done", () => {
    const d = draftFromPreset(getPreset("fabrik")!)
    expect(lookDone(d)).toBe(true)
    expect(d.background).toBe("#3a3c83")
  })

  it("round-trips: the copy is the preset", () => {
    for (const id of ["fabrik", "pacha", "ushuaia"]) {
      const p = getPreset(id)!
      const t = draftToTheme({ ...draftFromPreset(p), label: p.label })
      expect(t.palette.background).toBe(p.palette.background)
      expect(t.fonts.display).toEqual(p.fonts.display)
      expect(t.radius).toBe(p.radius)
      expect(t.material).toBe(p.material)
    }
  })
})
