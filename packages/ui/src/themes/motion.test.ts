import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

import { describe, expect, it } from "vitest"

import { EASING, MOTION_STYLES, SPRING, TIMING, TRANSITION_SPEEDS, easeVar, motionCssTokens, springEasing } from "./motion"

const css = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "../styles/tokens.css"), "utf8")

describe("motion tokens", () => {
  it("are the Figma's: the curves, the springs and the timings", () => {
    expect(EASING["ease-out"].normal).toEqual([0, 0, 0.35, 1])
    expect(EASING["ease-in-out"].normal).toEqual([0.8, 0, 0.2, 1])
    expect(EASING["ease-in-out"].back).toEqual([0.4, -0.6, 0.6, 1.6])
    expect(SPRING).toEqual({ subtle: 0.5, normal: 0.7005, expressive: 0.75 })
    expect(TIMING).toEqual({ instant: 0, fast: 0.2, faster: 0.4, long: 0.8, longer: 1.2, longest: 2.4 })
  })

  it("are written in tokens.css exactly as the code has them", () => {
    for (const [name, value] of Object.entries(motionCssTokens())) {
      expect(css, name).toContain(`${name}: ${value};`)
    }
    expect(easeVar("ease-in-out", "normal")).toBe("--ease-in-out-normal")
  })

  it("make Component Animations: ease is ease-out and slower, emphatic is ease-in-out and faster", () => {
    expect(MOTION_STYLES.ease.curve).toEqual(EASING["ease-out"].normal)
    expect(MOTION_STYLES.emphatic.curve).toEqual(EASING["ease-in-out"].normal)
    expect(MOTION_STYLES.ease.duration).toBe(0.8)
    expect(MOTION_STYLES.emphatic.duration).toBe(0.4)
    expect(MOTION_STYLES.ease.duration).toBeGreaterThan(MOTION_STYLES.emphatic.duration)
    expect(MOTION_STYLES.springy.spring).toBe(SPRING.normal)
    expect(MOTION_STYLES.none.duration).toBe(0)
  })

  it("make a spring easing that starts at 0, overshoots when it bounces, and ends at 1", () => {
    const values = (css: string) => css.replace("linear(", "").replace(")", "").split(", ").map(Number)
    const bouncy = values(springEasing(SPRING.normal, 0.8))
    expect(bouncy[0]).toBe(0)
    expect(bouncy.at(-1)).toBe(1)
    expect(Math.max(...bouncy)).toBeGreaterThan(1)
    expect(Math.max(...values(springEasing(0, 0.8)))).toBeLessThanOrEqual(1.001)
  })

  it("set the page-transition speeds from the timings", () => {
    expect(TRANSITION_SPEEDS).toEqual({ slow: 1.2, medium: 0.8, fast: 0.4 })
  })
})
