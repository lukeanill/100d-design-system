import { describe, expect, it } from "vitest"

import { BODY_FONTS, DEFAULT_THEME_ID, HEADING_FONTS, getPreset, presets } from "./presets"
import { themeDeclarations, themeStyle, themeToCss } from "./css"
import { themeToFile, slugify } from "./file"
import { googleFontsHref } from "./fonts"
import { VALUE_QUESTIONS } from "./values"
import { isHex, normalizeHex, oklch, onColor } from "./color"
import { NO_FEEL } from "./types"

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

describe("font roles", () => {
  it("offer headings only the nine themes' heading fonts, and body text only their body fonts", () => {
    expect(HEADING_FONTS.map((f) => f.family).sort()).toEqual(
      [...new Set(presets.map((t) => t.fonts.display.family))].sort()
    )
    const bodyFaces = new Set(presets.flatMap((t) => [t.fonts.body.family, t.fonts.serif.family]))
    expect(BODY_FONTS.map((f) => f.family).sort()).toEqual([...bodyFaces].sort())
    // a sans or a serif: the themes' body faces and the serifs they use for emphasis
    expect(BODY_FONTS.map((f) => f.family)).toEqual(
      expect.arrayContaining(["Inter", "DM Sans", "Archivo", "Karla", "EB Garamond", "Lora", "Newsreader"])
    )
    expect(HEADING_FONTS.map((f) => f.family)).not.toContain("Inter")
    expect(BODY_FONTS.map((f) => f.family)).not.toContain("Migra")
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

  it("makes a hover `fast` from the Timing set, and instant where the theme's motion is none", () => {
    expect(themeDeclarations(getPreset("laroc")!)).toContain("--motion-fast: var(--duration-instant);")
    expect(themeDeclarations(getPreset("savaya")!)).toContain("--motion-fast: var(--duration-fast);")
    expect(themeDeclarations(getPreset("pacha")!)).toContain("--motion-fast: var(--duration-fast);")
  })

  it("scales the shadows with elevation", () => {
    expect(themeDeclarations(getPreset("illuzion")!)).toContain("--shadow-md: none;")
    expect(themeDeclarations(getPreset("berghain")!).find((l) => l.startsWith("--shadow-md"))).toContain("20px 20px 40px")
  })

  it("scales heading and body sizes with --type-scale, and medium is the sizes as shipped", () => {
    const scaleOf = (id: string, scale: "sm" | "md" | "lg") =>
      themeDeclarations({ ...getPreset(id)!, scale }).filter((l) => l.startsWith("--type-scale") || l.startsWith("--text-"))
    expect(scaleOf("berghain", "md")).toContain("--type-scale: 1;")
    expect(scaleOf("berghain", "sm")).toContain("--type-scale: 0.875;")
    expect(scaleOf("berghain", "lg")).toContain("--type-scale: 1.125;")
    expect(scaleOf("berghain", "md")).toContain("--text-sm: calc(0.875rem * var(--type-scale));")
    for (const t of presets) expect(t.scale, t.id).toBe("md")
  })

  it("gives each preset the tone and motion the Figma gives it, and nothing else of the feel", () => {
    const figma: Record<string, [string, string]> = {
      fabrik: ["emphatic", "light"], illuzion: ["ease", "light"], laroc: ["none", "light"], bootshaus: ["ease", "dark"],
      berghain: ["ease", "dark"], savaya: ["emphatic", "dark"], pacha: ["springy", "light"], amnesia: ["ease", "dark"], ushuaia: ["ease", "light"],
    }
    for (const t of presets) {
      expect([t.motion, t.tone], t.id).toEqual(figma[t.id])
      expect(t.feel, t.id).toEqual(NO_FEEL)
    }
  })

  it("makes a card from the tone: solid 20%, gradient 10% to 20%, glass the background", () => {
    const base = getPreset("fabrik")! // solid
    const solid = (tone: "dark" | "light") => themeDeclarations({ ...base, material: "solid", tone })
    expect(solid("light")).toContain("--card: color-mix(in oklab, var(--background), white 20%);")
    expect(solid("dark")).toContain("--card: color-mix(in oklab, var(--background), black 20%);")
    expect(solid("dark")).toContain("--card-image: none;")
    const grad = themeDeclarations({ ...base, material: "gradient", tone: "dark" })
    expect(grad).toContain("--card-image: linear-gradient(180deg, color-mix(in oklab, var(--background), black 10%), color-mix(in oklab, var(--background), black 20%));")
    const glass = (tone: "dark" | "light") => themeDeclarations({ ...base, material: "glass", tone }).join("\n")
    expect(glass("dark")).toContain("oklch(0 0 0)")
    expect(glass("light")).toContain("oklch(1 0 0)")
    expect(glass("light")).toContain("--card: var(--background);")
  })

  it("writes component motion and the feel as tokens, for every theme", () => {
    const lines = (t: Parameters<typeof themeDeclarations>[0]) => themeDeclarations(t)
    expect(lines(getPreset("illuzion")!)).toContain("--motion-ease: cubic-bezier(0, 0, 0.35, 1);")
    expect(lines(getPreset("illuzion")!)).toContain("--motion-duration: 0.8s;")
    expect(lines(getPreset("fabrik")!)).toContain("--motion-ease: cubic-bezier(0.8, 0, 0.2, 1);")
    expect(lines(getPreset("fabrik")!)).toContain("--motion-duration: 0.4s;")
    expect(lines(getPreset("pacha")!)).toContain("--motion-spring-bounce: 0.7005;")
    expect(lines(getPreset("laroc")!)).toContain("--motion-duration: 0s;")
    const feel = { ...NO_FEEL, transition: "curtain-iris" as const, transitionSpeed: "slow" as const, animatedBackground: "aurora" as const, animatedBackgroundInverse: true, animatedBackgroundOverlay: 40 as const }
    const out = lines({ ...getPreset("berghain")!, feel })
    expect(out).toContain("--theme-transition: curtain-iris;")
    expect(out).toContain("--theme-transition-duration: 1.2s;")
    expect(out).toContain("--theme-background: aurora;")
    expect(out).toContain("--theme-background-inverse: true;")
    expect(out).toContain("--theme-background-overlay: 40%;")
  })

  it("carries the settings components do not read yet", () => {
    const css = themeDeclarations(getPreset("ushuaia")!).join("\n")
    expect(css).toContain("--theme-material: gradient;")
    expect(css).toContain("--theme-spacing: lg;")
  })

  it("gives themeStyle the same declarations as an inline style", () => {
    const style = themeStyle(getPreset("laroc")!)
    expect(style.colorScheme).toBe("light")
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

  it("says the type scale and accepts the small spacing", () => {
    const file = themeToFile({ ...theme, scale: "lg", spacing: "sm" })
    expect(file).toContain("type scale lg")
    expect(file).toContain("--theme-spacing: sm;")
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
