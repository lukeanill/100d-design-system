import { describe, expect, it } from "vitest"

import { DEFAULT_THEME_ID, getPreset, presets } from "./presets"
import { themeDeclarations, themeStyle, themeToCss } from "./css"
import { themeToFile, slugify } from "./file"
import { googleFontsHref } from "./fonts"
import { VALUE_QUESTIONS } from "./values"
import { isHex, normalizeHex, oklch, onColor } from "./color"

describe("presets", () => {
  it("are the nine from Figma, in the Figma order, with Berghain the default wherever it sits", () => {
    expect(presets.map((t) => t.id)).toEqual(["fabrik", "illuzion", "laroc", "bootshaus", "berghain", "savaya", "pacha", "amnesia", "ushuaia"])
    expect(DEFAULT_THEME_ID).toBe("berghain")
  })

  it("answer every UX question with the first option, for the designer to change", () => {
    for (const t of presets) expect(t.values).toEqual(["a", "a", "a", "a"])
  })

  it("give every theme the same tokens, so nothing falls through to another theme", () => {
    const names = (t: (typeof presets)[number]) => themeDeclarations(t).map((l) => l.split(":")[0]).sort()
    const first = names(presets[0])
    for (const t of presets) expect(names(t), t.id).toEqual(first)
  })

  it("never emit an empty value", () => {
    for (const t of presets) for (const line of themeDeclarations(t)) expect(line, `${t.id}: ${line}`).toMatch(/^[\w-]+: .+;$/)
  })
})

describe("themeToCss", () => {
  it("scopes the default theme to :root and its own class, and every other theme to its class only", () => {
    expect(themeToCss(getPreset("berghain")!, { asDefault: true })).toMatch(/^:root,\n\.berghain \{/)
    expect(themeToCss(getPreset("fabrik")!)).toMatch(/^\.fabrik \{/)
  })

  it("turns glass on for glass themes and explicitly off for the rest", () => {
    const on = themeDeclarations(getPreset("berghain")!).join("\n")
    const off = themeDeclarations(getPreset("fabrik")!).join("\n")
    expect(on).toContain("--glass-card-blur: 64px;")
    expect(off).toContain("--glass-card-blur: 0px;")
  })

  it("scales the shadows with elevation", () => {
    expect(themeDeclarations(getPreset("illuzion")!)).toContain("--shadow-md: none;")
    expect(themeDeclarations(getPreset("berghain")!).find((l) => l.startsWith("--shadow-md"))).toContain("20px 20px 40px")
  })

  it("carries the settings components do not read yet", () => {
    const css = themeDeclarations(getPreset("ushuaia")!).join("\n")
    expect(css).toContain("--theme-material: gradient;")
    expect(css).toContain("--theme-spacing: lg;")
  })

  it("gives themeStyle the same declarations as an inline style", () => {
    const style = themeStyle(getPreset("laroc")!)
    expect(style.colorScheme).toBe("dark")
    expect(style["--radius"]).toBe("1.5rem")
  })
})

describe("themeToFile", () => {
  const theme = { ...getPreset("illuzion")!, id: "my-theme", label: "My theme" }

  it("tells the AI how to use the theme", () => {
    const file = themeToFile(theme)
    expect(file).toContain('<ThemeProvider forcedTheme="my-theme">')
    expect(file).toContain('import "./my-theme.css"')
    expect(file).toContain("never hard-coded colours")
  })

  it("saves the UX direction as words, not codes", () => {
    const file = themeToFile(theme)
    for (const q of VALUE_QUESTIONS) {
      expect(file).toContain(q.question)
      expect(file).toContain(q.a.description)
    }
  })

  it("imports only Google families, never the bundled ones", () => {
    const href = googleFontsHref([{ family: "PP Editorial New" }, { family: "Karla" }])!
    expect(href).toContain("family=Karla")
    expect(href).not.toContain("PP+Editorial")
    expect(themeToFile({ ...getPreset("berghain")!, id: "x" })).not.toContain("PP+Editorial")
  })

  it("says which values were left empty", () => {
    expect(themeToFile(theme, { unset: ["edges", "spacing"] })).toContain("edges, spacing were left empty")
  })

  it("is the theme's CSS after the header", () => {
    expect(themeToFile(theme)).toContain(themeToCss(theme))
  })
})

describe("helpers", () => {
  it("slugifies names, falling back when there is nothing to use", () => {
    expect(slugify("Chill Light!")).toBe("chill-light")
    expect(slugify("  Über  Thème ")).toBe("uber-theme")
    expect(slugify("???")).toBe("my-theme")
    expect(slugify("")).toBe("my-theme")
  })

  it("reads hex in either form and rejects the rest", () => {
    expect(isHex("#1a2b3c")).toBe(true)
    expect(isHex("1a2b3c")).toBe(true)
    expect(isHex("#fff")).toBe(true)
    expect(isHex("zzz")).toBe(false)
    expect(isHex("#12")).toBe(false)
    expect(normalizeHex("#FFF")).toBe("#ffffff")
  })

  it("converts hex to oklch, with an alpha when asked", () => {
    expect(oklch("#000000")).toBe("oklch(0.000 0.000 0.00)")
    expect(oklch("#ffffff", 15)).toMatch(/^oklch\(1\.000 0\.000 [\d.]+ \/ 15%\)$/)
  })

  it("picks readable ink for a fill", () => {
    expect(onColor("#000000")).toBe("#ffffff")
    expect(onColor("#ffffff")).toBe("#0f0e0e")
  })
})
