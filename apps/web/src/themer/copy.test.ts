import { describe, expect, it } from "vitest"

import { presets, themeDeclarations } from "@workspace/ui/themes"

import { settingsOf, specimenOf } from "./Copy"

const tokens = (t: (typeof presets)[number]) =>
  Object.fromEntries(
    themeDeclarations(t).map((l) => {
      const i = l.indexOf(":")
      return [l.slice(0, i).replace(/^--/, ""), l.slice(i + 1).replace(/;$/, "").trim()]
    })
  )

const WORDS: Record<string, string> = { sm: "small", md: "medium", lg: "large" }

describe("the Copy a Theme preview", () => {
  it("says, for every preset, exactly what the theme writes: shadow, spacing, texture, color and motion", () => {
    for (const t of presets) {
      const shown = Object.fromEntries(settingsOf(t))
      const css = tokens(t)
      expect(shown.shadow, t.id).toBe(css["theme-shadow"])
      expect(shown.spacing, t.id).toBe(WORDS[css["theme-spacing"]])
      expect(shown.texture, t.id).toBe(css["theme-material"])
      expect(shown.color, t.id).toBe(css["theme-color-mode"])
      expect(shown.motion, t.id).toBe(css["theme-motion"])
    }
  })

  it("says the radius the theme applies: each name is its own --radius", () => {
    for (const t of presets) {
      expect(Object.fromEntries(settingsOf(t)).radius, t.id).toBe(t.radius)
      const radii = (["sharp", "subtle", "strong", "rounded"] as const).map((r) => tokens({ ...t, radius: r }).radius)
      expect(new Set(radii).size, "four names, four radii").toBe(4)
      expect(tokens(t).radius).toBe(tokens({ ...t, radius: t.radius }).radius)
    }
  })

  it("follows the theme, not a list: change a setting and the panel changes with it", () => {
    const t = presets[0]
    const changed = Object.fromEntries(settingsOf({ ...t, shadow: "none", spacing: "sm", material: "gradient", motion: "springy" }))
    expect(changed).toMatchObject({ shadow: "none", spacing: "small", texture: "gradient", motion: "springy" })
  })

  it("shows the fonts the theme really uses, never a label for another one", () => {
    for (const t of presets) {
      expect(specimenOf(t)).toEqual({ heading: t.fonts.display.family, body: t.fonts.body.family })
    }
    expect(specimenOf({ ...presets[0], fonts: { ...presets[0].fonts, display: { family: "Gloock", weight: 400 } } }).heading).toBe("Gloock")
  })
})
