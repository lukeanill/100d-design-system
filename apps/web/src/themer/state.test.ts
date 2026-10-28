import { describe, expect, it } from "vitest"

import { getPreset } from "@workspace/ui/themes"

import { themeStyle } from "@workspace/ui/themes"

import { ALPES, BASELINE, badColors, draftFromPreset, draftToTheme, emptyDraft, feelDone, feelMissing, lookDone, lookMissing, productStyle, unsetLabels, valuesDone, valuesMissing } from "./state"

describe("a theme built from scratch", () => {
  it("shows the Alpes page untouched: no preset is applied by default", () => {
    expect(productStyle(emptyDraft())).toEqual(themeStyle(ALPES))
  })

  it("starts empty, so nothing counts as done", () => {
    const d = emptyDraft()
    expect(lookDone(d)).toBe(false)
    expect(valuesDone(d)).toBe(false)
    expect(unsetLabels(d)).toContain("background")
  })

  it("lays each choice over the page as it is made, and only that choice", () => {
    const base = productStyle(emptyDraft())
    const style = productStyle({ ...emptyDraft(), primary: "#0000ff" })
    expect(style["--primary"]).not.toBe(base["--primary"])
    expect(style["--background"]).toBe(base["--background"])
  })

  it("derives readable foregrounds from a chosen background", () => {
    const dark = productStyle({ ...emptyDraft(), background: "#101820" })
    const light = productStyle({ ...emptyDraft(), background: "#f5f0e6" })
    expect(dark["--foreground"]).not.toBe(light["--foreground"])
  })

  it("fills what is empty from Berghain when a file is made", () => {
    const theme = draftToTheme({ ...emptyDraft(), primary: "#336699" })
    expect(theme.palette.background).toBe(BASELINE.palette.background)
    expect(theme.radius).toBe(BASELINE.radius)
    expect(theme.id).toBe("my-theme")
    expect(theme.values).toEqual(["a", "a", "a", "a"])
  })

  it("lets the foreground be chosen, and otherwise derives it from the background", () => {
    expect(draftToTheme({ ...emptyDraft(), background: "#101820", foreground: "#ffcc00" }).palette.foreground).toBe("#ffcc00")
    expect(draftToTheme({ ...emptyDraft(), background: "#101820" }).palette.foreground).toBe("#ffffff")
    expect(draftToTheme({ ...emptyDraft(), foreground: "zzz" }).palette.foreground).toBe(BASELINE.palette.foreground)
    expect(badColors({ ...emptyDraft(), foreground: "zzz" })).toEqual(["foreground"])
  })

  it("needs the texture tone like every other Look choice", () => {
    expect(unsetLabels(emptyDraft())).toContain("texture tone")
    expect(draftToTheme({ ...emptyDraft(), tone: "light" }).tone).toBe("light")
    // a copied preset brings the tone the Figma gives it (Settings/color), so only the name is left
    expect(draftFromPreset(getPreset("laroc")!).tone).toBe("light")
    expect(lookMissing(draftFromPreset(getPreset("laroc")!))).toEqual(["theme name"])
  })

  it("holds Look back until the name and every choice are made, and Values until every question is answered", () => {
    const done = draftFromPreset(getPreset("fabrik")!)
    expect(lookMissing(done)).toEqual(["theme name"])
    expect(lookDone({ ...done, label: "  " })).toBe(false)
    expect(lookDone({ ...done, label: "Mine" })).toBe(true)
    expect(lookMissing(emptyDraft())).toEqual(expect.arrayContaining(["theme name", "background", "texture tone"]))
    expect(valuesMissing(emptyDraft())).toEqual(["question 1", "question 2", "question 3", "question 4"])
    expect(valuesMissing({ ...emptyDraft(), values: ["a", "b", undefined, "a"] })).toEqual(["question 3"])
  })

  it("holds Feel back until every question is answered, none being an answer", () => {
    expect(feelMissing(emptyDraft())).toEqual([
      "component animations", "page transition", "animated background", "hero heading", "hero text entry", "button click", "link hover",
    ])
    const answered = { ...emptyDraft(), motion: "none" as const, transition: "none" as const, animatedBackground: "none" as const, heroHeading: "none" as const, heroText: "none" as const, buttonClick: "none" as const, linkHover: "none" as const }
    expect(feelDone(answered)).toBe(true)
    // a transition asks for its colour and speed, a background for its overlay
    expect(feelMissing({ ...answered, transition: "iris" })).toEqual(["transition color", "transition speed"])
    expect(feelMissing({ ...answered, transition: "iris", transitionColor: "primary", transitionSpeed: "fast" })).toEqual([])
    expect(feelMissing({ ...answered, animatedBackground: "aurora" })).toEqual(["background overlay"])
    // a copied preset has answered all of it: none everywhere, and its own motion
    expect(feelDone(draftFromPreset(getPreset("pacha")!))).toBe(true)
    expect(draftFromPreset(getPreset("pacha")!).motion).toBe("springy")
  })

  it("lays the Feel choices over the base theme, and the base's own where nothing is chosen", () => {
    const theme = draftToTheme({ ...emptyDraft(), motion: "emphatic", transition: "curtain-iris", transitionSpeed: "slow", heroText: "typewriter" })
    expect(theme.motion).toBe("emphatic")
    expect(theme.feel.transition).toBe("curtain-iris")
    expect(theme.feel.transitionSpeed).toBe("slow")
    expect(theme.feel.heroText).toBe("typewriter")
    expect(theme.feel.heroHeading).toBe("none")
    expect(draftToTheme(emptyDraft()).motion).toBe(BASELINE.motion)
  })

  it("takes the type scale and small spacing, and says which Look choices are empty", () => {
    const theme = draftToTheme({ ...emptyDraft(), scale: "lg", spacing: "sm" })
    expect(theme.scale).toBe("lg")
    expect(theme.spacing).toBe("sm")
    expect(unsetLabels(emptyDraft())).toEqual(expect.arrayContaining(["foreground", "type scale", "texture", "icons"]))
    expect(unsetLabels(emptyDraft())).not.toContain("icon style")
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
  it("opens every value, so only the name is left for Look", () => {
    const d = draftFromPreset(getPreset("fabrik")!)
    expect(lookDone(d)).toBe(false)
    expect(lookDone({ ...d, label: "Mine" })).toBe(true)
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
