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
    const bodyFaces = new Set(presets.flatMap((t) => [t.fonts.body.family]))
    expect(BODY_FONTS.map((f) => f.family).sort()).toEqual([...bodyFaces].sort())
    // a sans or a serif: the themes' body faces
    expect(BODY_FONTS.map((f) => f.family)).toEqual(
      expect.arrayContaining(["Inter", "DM Sans", "Archivo", "Akkurat LL TT"])
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

  it("scales the shadows with the shadow setting", () => {
    expect(themeDeclarations(getPreset("illuzion")!)).toContain("--shadow-md: none;")
    expect(themeDeclarations(getPreset("berghain")!).find((l) => l.startsWith("--shadow-md"))).toContain("0px 20px 40px")
  })

  it("writes the Figma strong shadow variables, with no horizontal offset", () => {
    const shadows = themeDeclarations(getPreset("berghain")!).filter((l) => /^--shadow-(xs|sm|md|lg):/.test(l))
    expect(shadows).toEqual([
      "--shadow-xs: 0px 4px 8px rgb(34 34 34 / 8%);",
      "--shadow-sm: 0px 12px 20px rgb(34 34 34 / 12%);",
      "--shadow-md: 0px 20px 40px rgb(34 34 34 / 16%);",
      "--shadow-lg: 0px 40px 80px rgb(34 34 34 / 24%);",
    ])
  })

  it("writes the Figma typescale sizes for the theme's mode, with no multiplier", () => {
    const sizesOf = (id: string, scale: "sm" | "md" | "lg") => themeDeclarations({ ...getPreset(id)!, scale })
    expect(sizesOf("berghain", "sm")).toContain("--typescale-h1: 3.75rem;")
    expect(sizesOf("berghain", "md")).toContain("--typescale-h1: 4.5rem;")
    expect(sizesOf("berghain", "lg")).toContain("--typescale-h1: 5.5rem;")
    expect(sizesOf("berghain", "md")).toContain("--typescale-sm: 0.875rem;")
    expect(sizesOf("berghain", "md")).toContain("--text-sm: var(--typescale-sm);")
    expect(sizesOf("berghain", "md")).toContain("--text-base: var(--typescale-md);")
    expect(sizesOf("berghain", "md")).toContain("--h1-size: var(--typescale-h1);")
    // Tailwind's text sizes take the Figma line-heights: 160% for body steps, 140% for heading steps
    expect(sizesOf("berghain", "md")).toContain("--text-sm--line-height: 1.6;")
    expect(sizesOf("berghain", "md")).toContain("--text-xl: var(--typescale-lg);")
    expect(sizesOf("berghain", "md")).toContain("--text-xl--line-height: 1.6;")
    expect(sizesOf("berghain", "md")).toContain("--text-2xl--line-height: 1.4;")
    expect(sizesOf("berghain", "md")).toContain("--text-7xl--line-height: 1.4;")
    expect(sizesOf("berghain", "md").join("\n")).not.toContain("type-scale")
  })

  it("writes the Figma primary, secondary and action weights for each theme", () => {
    const decl = (id: string) => themeDeclarations(getPreset(id)!).join("\n")
    const berghain = decl("berghain")
    expect(berghain).toContain("--font-primary-weight-regular: 200;")
    expect(berghain).toContain("--font-primary-weight-emphasis: 800;")
    expect(berghain).toContain("--font-secondary-weight-emphasis: 800;")
    expect(berghain).toContain("--font-secondary-style: italic;")
    expect(berghain).toContain("--font-body-weight-action: 400;")
    expect(decl("illuzion")).toContain("--font-body-weight-action: 500;")
    expect(decl("illuzion")).toContain("--font-secondary-style: normal;")
    expect(decl("bootshaus")).toContain("--font-primary-weight-emphasis: 800;")
  })

  it("gives each preset the typescale mode the Figma's settings/typescale gives it", () => {
    const figma: Record<string, string> = {
      fabrik: "md", illuzion: "lg", laroc: "sm", bootshaus: "lg", berghain: "md", savaya: "md", pacha: "lg", amnesia: "md", ushuaia: "md",
    }
    for (const t of presets) expect(t.scale, t.id).toBe(figma[t.id])
  })

  it("gives each preset the color-mode and motion the Figma gives it, and nothing else of the feel", () => {
    const figma: Record<string, [string, string]> = {
      fabrik: ["emphatic", "light"], illuzion: ["ease", "light"], laroc: ["none", "dark"], bootshaus: ["ease", "dark"],
      berghain: ["ease", "dark"], savaya: ["emphatic", "dark"], pacha: ["springy", "light"], amnesia: ["ease", "dark"], ushuaia: ["ease", "light"],
    }
    for (const t of presets) {
      expect([t.motion, t.colorMode], t.id).toEqual(figma[t.id])
      expect(t.feel, t.id).toEqual(NO_FEEL)
    }
  })

  it("makes a card from the color-mode: solid 20%, gradient 10% to 20%, glass the background", () => {
    const base = getPreset("fabrik")! // solid
    const solid = (colorMode: "dark" | "light") => themeDeclarations({ ...base, material: "solid", colorMode })
    expect(solid("light")).toContain("--card: color-mix(in oklab, var(--background), white 20%);")
    expect(solid("dark")).toContain("--card: color-mix(in oklab, var(--background), black 20%);")
    expect(solid("dark")).toContain("--card-image: none;")
    const grad = themeDeclarations({ ...base, material: "gradient", colorMode: "dark" })
    expect(grad).toContain("--card-image: linear-gradient(180deg, color-mix(in oklab, var(--background), black 10%), color-mix(in oklab, var(--background), black 20%));")
    const glass = (colorMode: "dark" | "light") => themeDeclarations({ ...base, material: "glass", colorMode }).join("\n")
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
    expect(style.colorScheme).toBe("dark")
    expect(style["--radius"]).toBe("1.5rem")
  })

  it("emits the Figma radius steps xs to xl for each radius", () => {
    const steps = (id: string) => {
      const s = themeStyle(getPreset(id)!)
      return ["--radius-xs", "--radius-sm", "--radius-md", "--radius-lg", "--radius-xl"].map((k) => s[k])
    }
    expect(steps("berghain")).toEqual(["0.125rem", "0.25rem", "0.5rem", "0.75rem", "1rem"])
    expect(steps("illuzion")).toEqual(["0.25rem", "0.5rem", "1rem", "1.5rem", "2rem"])
    expect(steps("laroc")).toEqual(["0.5rem", "1rem", "1.5rem", "2rem", "2.5rem"])
    expect(steps("fabrik")).toEqual(["0", "0", "0", "0", "0"])
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
    expect(themeToFile(theme, { unset: ["radius", "spacing"] })).toContain("radius, spacing were left empty")
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
