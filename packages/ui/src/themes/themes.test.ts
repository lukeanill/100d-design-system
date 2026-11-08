import { describe, expect, it } from "vitest"

import { BODY_FONTS, DEFAULT_THEME_ID, HEADING_FONTS, getPreset, presets } from "./presets"
import { themeDeclarations, themeStyle, themeToCss } from "./css"
import { themeToFile, slugify } from "./file"
import { googleFontsHref } from "./fonts"
import { VALUE_QUESTIONS } from "./values"
import { isHex, normalizeHex, oklch, onColor } from "./color"
import { NO_FEEL } from "./types"
import { TYPESCALE } from "./typescale"
import { figmaVariableFor } from "./figma-map"
import { glassProps } from "../components/liquid-glass"

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
  it("scopes the default theme to :where(:root) and its own class, and every other theme to its class only", () => {
    expect(themeToCss(getPreset("berghain")!, { asDefault: true })).toMatch(/^:where\(:root\),\n\.berghain \{/)
    expect(themeToCss(getPreset("fabrik")!)).toMatch(/^\.fabrik \{/)
  })

  it("turns glass on for glass themes and explicitly off for the rest", () => {
    const on = themeDeclarations(getPreset("berghain")!).join("\n")
    const off = themeDeclarations(getPreset("illuzion")!).join("\n")
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

  it("writes each font role's Figma letter spacing", () => {
    const decl = (id: string) => themeDeclarations(getPreset(id)!)
    expect(decl("bootshaus")).toContain("--font-primary-letter-spacing: -0.02em;")
    expect(decl("bootshaus")).toContain("--font-secondary-letter-spacing: -0.02em;")
    expect(decl("berghain")).toContain("--font-primary-letter-spacing: 0em;")
    expect(decl("fabrik")).toContain("--font-body-letter-spacing: 0em;")
    expect(decl("savaya")).toContain("--font-body-letter-spacing: 0.01em;")
  })

  it("uses the Figma body faces for Fabrik and Savaya", () => {
    expect(getPreset("fabrik")!.fonts.body).toMatchObject({ family: "PP Neue Montreal", weight: 100 })
    expect(getPreset("savaya")!.fonts.body).toMatchObject({ family: "Newsreader", weight: 400 })
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
    expect(sizesOf("berghain", "sm")).toContain("--typescale-h1: 3.5625rem;")
    expect(sizesOf("berghain", "md")).toContain("--typescale-h1: 4.5rem;")
    expect(sizesOf("berghain", "lg")).toContain("--typescale-h1: 5.5rem;")
    expect(sizesOf("berghain", "md")).toContain("--typescale-sm: 0.875rem;")
    expect(sizesOf("berghain", "md")).toContain("--text-sm: var(--typescale-sm);")
    expect(sizesOf("berghain", "md")).toContain("--text-base: var(--typescale-md);")
    expect(sizesOf("berghain", "md")).toContain("--h1-size: var(--typescale-h1);")
    // Tailwind's text sizes take the theme's line-height tokens (default 160% for body steps, 140% for heading steps)
    expect(sizesOf("berghain", "md")).toContain("--text-sm--line-height: var(--font-body-line-height);")
    expect(sizesOf("berghain", "md")).toContain("--text-xl: var(--typescale-lg);")
    expect(sizesOf("berghain", "md")).toContain("--text-xl--line-height: var(--font-body-line-height);")
    expect(sizesOf("berghain", "md")).toContain("--text-2xl--line-height: var(--font-primary-line-height);")
    expect(sizesOf("berghain", "md")).toContain("--text-7xl--line-height: var(--font-primary-line-height);")
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
    expect(decl("illuzion")).toContain("--font-body-weight-action: 450;")
    expect(decl("illuzion")).toContain("--font-secondary-style: normal;")
    expect(decl("bootshaus")).toContain("--font-primary-weight-emphasis: 800;")
  })

  it("gives each preset the typescale mode the Figma's settings/typescale gives it", () => {
    const figma: Record<string, string> = {
      fabrik: "sm", illuzion: "lg", laroc: "sm", bootshaus: "lg", berghain: "md", savaya: "md", pacha: "lg", amnesia: "md", ushuaia: "md",
    }
    for (const t of presets) expect(t.scale, t.id).toBe(figma[t.id])
  })

  it("gives each preset the color-mode and motion the Figma gives it, and nothing else of the feel", () => {
    const figma: Record<string, [string, string]> = {
      fabrik: ["springy", "light"], illuzion: ["ease", "light"], laroc: ["none", "dark"], bootshaus: ["ease", "dark"],
      berghain: ["ease", "dark"], savaya: ["emphatic", "dark"], pacha: ["springy", "light"], amnesia: ["ease", "dark"], ushuaia: ["ease", "light"],
    }
    for (const t of presets) {
      expect([t.motion, t.colorMode], t.id).toEqual(figma[t.id])
      expect(t.feel, t.id).toEqual(NO_FEEL)
    }
  })

  it("makes a card from the color-mode: solid 20%, gradient 10% to 20%, glass the background", () => {
    const base = getPreset("illuzion")! // solid
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
    expect(lines(getPreset("savaya")!)).toContain("--motion-ease: cubic-bezier(0.8, 0, 0.2, 1);")
    expect(lines(getPreset("savaya")!)).toContain("--motion-duration: 0.4s;")
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
    expect(steps("fabrik")).toEqual(["0.25rem", "0.5rem", "1rem", "1.5rem", "2rem"])
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

describe("font weights", () => {
  it("match the Figma font weight and letter-spacing variables for every theme", () => {
    // from the Figma `theme` collection: primary and secondary regular/emphasis, body regular/action
    const figma: Record<string, { primary: [number, number]; secondary: [number, number]; body: [number, number]; ls: { primary: number; secondary: number; body: number } }> = {
      fabrik: { primary: [420, 320], secondary: [460, 640], body: [100, 400], ls: { primary: 0, secondary: 0, body: 0 } },
      illuzion: { primary: [400, 400], secondary: [400, 400], body: [450, 450], ls: { primary: 0, secondary: 0, body: 1 } },
      laroc: { primary: [700, 700], secondary: [700, 700], body: [400, 400], ls: { primary: 0, secondary: 0, body: 0 } },
      bootshaus: { primary: [800, 800], secondary: [800, 800], body: [500, 500], ls: { primary: -2, secondary: -2, body: 0 } },
      berghain: { primary: [200, 800], secondary: [200, 800], body: [200, 400], ls: { primary: 0, secondary: 0, body: 0 } },
      savaya: { primary: [400, 400], secondary: [400, 400], body: [400, 400], ls: { primary: 0, secondary: 0, body: 1 } },
      pacha: { primary: [400, 400], secondary: [400, 400], body: [500, 500], ls: { primary: 0, secondary: 0, body: 1 } },
      amnesia: { primary: [500, 500], secondary: [500, 500], body: [400, 400], ls: { primary: 0, secondary: 0, body: 0 } },
      ushuaia: { primary: [800, 800], secondary: [800, 800], body: [400, 400], ls: { primary: 0, secondary: 0, body: 0 } },
    }
    for (const t of presets) {
      const f = figma[t.id]
      const { display, secondary, body } = t.fonts
      expect([display.weight, display.emphasis ?? display.weight], `${t.id} primary`).toEqual(f.primary)
      expect([secondary.weight, secondary.emphasis ?? secondary.weight], `${t.id} secondary`).toEqual(f.secondary)
      expect([body.weight, body.actionWeight ?? body.weight], `${t.id} body`).toEqual(f.body)
      expect(display.letterSpacing ?? 0, `${t.id} primary letter-spacing`).toBe(f.ls.primary)
      expect(secondary.letterSpacing ?? 0, `${t.id} secondary letter-spacing`).toBe(f.ls.secondary)
      expect(body.letterSpacing ?? 0, `${t.id} body letter-spacing`).toBe(f.ls.body)
    }
  })
})

describe("typescale", () => {
  it("has every size of the Figma typescale collection, in each of its three modes", () => {
    // xs, sm, md, lg, h6, h5, h4, h3, h2, h1: read from the Figma `typescale` collection
    const figma = {
      sm: [12, 13, 15, 18, 19, 23, 29, 37, 46, 57],
      md: [12, 14, 16, 18, 24, 30, 36, 48, 60, 72],
      lg: [14, 16, 18, 20, 26, 36, 44, 56, 72, 88],
    } as const
    for (const mode of ["sm", "md", "lg"] as const) {
      expect(Object.values(TYPESCALE[mode]), mode).toEqual([...figma[mode]])
    }
  })
})

describe("ui-color", () => {
  it("gives each preset the ui-color mode the Figma's settings/ui-color gives it", () => {
    const want: Record<string, string> = {
      fabrik: "modern", illuzion: "alternative", laroc: "classic", bootshaus: "modern", berghain: "modern",
      savaya: "modern", pacha: "alternative", amnesia: "modern", ushuaia: "classic",
    }
    for (const t of presets) expect(t.uiColor, t.id).toBe(want[t.id])
  })

  it("writes destructive, affirmative, focus and the five charts from the theme's mode", () => {
    const decl = (id: string) => themeDeclarations(getPreset(id)!)
    expect(decl("laroc")).toContain(`--destructive: ${oklch("#e7000b")};`)
    expect(decl("laroc")).toContain(`--affirmative: ${oklch("#00a81c")};`)
    expect(decl("fabrik")).toContain(`--focus: ${oklch("#ac64ff")};`)
    expect(decl("fabrik")).toContain(`--chart-5: ${oklch("#955e09")};`)
    expect(decl("pacha")).toContain(`--chart-1: ${oklch("#db50eb")};`)
    expect(decl("pacha")).toContain("--theme-ui-color: alternative;")
  })

  it("writes the new primitives color-700 and color-800, and Fabrik's own accent and popover", () => {
    const decl = themeDeclarations(getPreset("fabrik")!)
    expect(decl).toContain(`--primitive-700: ${oklch("#5b90ac")};`)
    expect(decl).toContain(`--primitive-800: ${oklch("#a77b84")};`)
    expect(decl).toContain(`--accent: ${oklch("#78565d")};`)
    expect(decl).toContain(`--popover: ${oklch("#2b2726")};`)
    expect(decl).toContain(`--muted-foreground: ${oklch("#a77b84")};`)
    expect(decl).toContain(`--accent-foreground: ${oklch("#a77b84")};`)
    expect(themeDeclarations(getPreset("berghain")!)).toContain("--accent: var(--secondary);")
    expect(themeDeclarations(getPreset("berghain")!)).toContain(`--muted-foreground: ${oklch("#fbfbfc", 65)};`)
  })
})

describe("figma map", () => {
  const fabrik = getPreset("fabrik")!
  const pacha = getPreset("pacha")!

  it("maps a code token to its Figma variable and the mode the theme uses", () => {
    expect(figmaVariableFor("primary", fabrik)).toEqual({ variable: "color/semantic/primary", mode: "fabrik" })
    expect(figmaVariableFor("--chart-1", pacha)).toEqual({ variable: "ui-color/chart-1", mode: "alternative" })
    expect(figmaVariableFor("affirmative", fabrik)).toEqual({ variable: "ui-color/affirmative", mode: "modern" })
    expect(figmaVariableFor("card", pacha)).toEqual({ variable: "settings/texture", mode: "solid" })
    expect(figmaVariableFor("primitive-800", fabrik)).toEqual({ variable: "color/primitive/color-800", mode: "fabrik" })
  })

  it("maps type, radius, shadow and motion tokens, with their own modes", () => {
    expect(figmaVariableFor("typescale-h1", fabrik)).toEqual({ variable: "typescale/h1", mode: "sm" })
    expect(figmaVariableFor("h2-size", fabrik)).toEqual({ variable: "typescale/h2", mode: "sm" })
    expect(figmaVariableFor("h1-weight", fabrik)).toEqual({ variable: "font/primary/regular", mode: "fabrik" })
    expect(figmaVariableFor("font-body-weight-action", fabrik)).toEqual({ variable: "font/body/action/weight", mode: "fabrik" })
    expect(figmaVariableFor("radius-button", pacha)).toEqual({ variable: "radius/button", mode: "rounded" })
    expect(figmaVariableFor("shadow-2xl", fabrik)).toEqual({ variable: "shadow/lg", mode: "strong" })
    expect(figmaVariableFor("duration-fast", fabrik)).toEqual({ variable: "timing/fast", mode: "single" })
    expect(figmaVariableFor("ease-in-out-normal", fabrik)).toEqual({ variable: "easing/emphatic/normal", mode: "single" })
  })

  it("has no Figma variable for tokens Figma does not define", () => {
    expect(figmaVariableFor("font-mono", fabrik)).toBeNull()
    expect(figmaVariableFor("glass-card-blur", fabrik)).toBeNull()
    expect(figmaVariableFor("font-primary-line-height", fabrik)).toBeNull()
  })
})

describe("glass popups", () => {
  const decl = (id: string) => themeDeclarations(getPreset(id)!)

  it("are plain Heavy glass on a glass theme: refraction on, no tint, the glass's own edge and shadow", () => {
    const heavy = glassProps("heavy")
    for (const id of ["fabrik", "bootshaus", "berghain", "savaya"]) {
      const d = decl(id)
      for (const group of ["select", "overlay"]) {
        expect(d, `${id} ${group}`).toContain(`--glass-${group}-refraction: 1;`)
        expect(d).toContain(`--glass-${group}-surface: transparent;`)
        // the numbers are LiquidGlass's heavy weight
        expect(d).toContain(`--glass-${group}-refraction-blur: ${heavy.blur};`)
        expect(d).toContain(`--glass-${group}-refraction-bezel: ${heavy.bezel};`)
        expect(d).toContain(`--glass-${group}-refraction-thickness: ${heavy.thickness};`)
        expect(d).toContain(`--glass-${group}-refraction-scale: ${heavy.scaleRatio};`)
        expect(d).toContain(`--glass-${group}-blur: ${heavy.fallbackBlur}px;`)
      }
      expect(d).toContain("--glass-popup-border: transparent;")
      expect(d).toContain("--glass-popup-color: var(--foreground);")
      expect(d.some((l) => l.startsWith("--glass-popup-shadow: 0 4px 24px"))).toBe(true)
      // cards are untouched: no refraction for them
      expect(d.some((l) => l.startsWith("--glass-card-refraction"))).toBe(false)
    }
  })

  it("leave a solid theme's popups as they were", () => {
    for (const id of ["illuzion", "laroc", "pacha", "amnesia", "ushuaia"]) {
      const d = decl(id)
      expect(d).toContain("--glass-select-refraction: 0;")
      expect(d).toContain("--glass-overlay-refraction: 0;")
      expect(d).toContain("--glass-select-surface: initial;")
      expect(d).toContain("--glass-popup-border: initial;")
      expect(d).toContain("--glass-popup-color: initial;")
      expect(d).toContain("--glass-popup-shadow: initial;")
    }
  })
})

describe("body emphasis weight", () => {
  it("is Book (400) on Fabrik, whose regular is Thin (100), and 600 everywhere else", () => {
    const decl = (id: string) => themeDeclarations(getPreset(id)!)
    expect(decl("fabrik")).toContain("--font-body-weight: 100;")
    expect(decl("fabrik")).toContain("--font-body-weight-emphasis: 400;")
    for (const id of ["illuzion", "laroc", "bootshaus", "berghain", "savaya", "pacha", "amnesia", "ushuaia"]) {
      expect(decl(id), id).toContain("--font-body-weight-emphasis: 600;")
    }
    expect(figmaVariableFor("font-body-weight-emphasis", getPreset("fabrik")!)).toEqual({ variable: "font/body/emphasis/weight", mode: "fabrik" })
  })
})

