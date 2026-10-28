// The Figma `motion` variable collection, as tokens: every easing curve, the springs and the
// timings. tokens.css carries the same values as CSS custom properties (--ease-*, --duration-*);
// motion.test.ts holds the two together. Cubic béziers are [x1, y1, x2, y2], as the `motion`
// library takes them.

export type Bezier = readonly [number, number, number, number]

/** Easing/ease-in-out, ease-in, ease-out and ease-out-in, by strength. */
export const EASING = {
  "ease-in-out": {
    normal: [0.8, 0, 0.2, 1],
    slight: [0.2, 0, 0, 1],
    strong: [0.7, 0, 0.04, 1],
    back: [0.4, -0.6, 0.6, 1.6],
  },
  "ease-in": {
    normal: [0.6, 0, 1, 0.8],
    strong: [0.95, 0, 1, 1],
    back: [0.4, -0.4, 1, 0.8],
  },
  "ease-out": {
    normal: [0, 0, 0.35, 1],
    strong: [0, 0, 0.02, 1],
    back: [0, 0.4, 0.4, 1.4],
  },
  "ease-out-in": {
    "transition-out-in": [0, 0.7, 1, 0.3],
  },
} as const satisfies Record<string, Record<string, Bezier>>

/** Easing/spring: the bounce of each. */
export const SPRING = { subtle: 0.5, normal: 0.7005, expressive: 0.75 } as const

/** Timing, in seconds. */
export const TIMING = { instant: 0, fast: 0.2, faster: 0.4, long: 0.8, longer: 1.2, longest: 2.4 } as const

/** The Figma's `hold` easing: ease-out. */
export const HOLD: Bezier = [0, 0, 0.58, 1]

export const cubicBezier = (b: Bezier) => `cubic-bezier(${b.join(", ")})`

/** The custom property a curve is written as: ease-in-out, normal is --ease-in-out-normal. */
export const easeVar = (group: keyof typeof EASING, strength: string) => `--${group}-${strength}`

/**
 * The Component Animations choice (the Figma's `Settings/motion`): what each one is made of.
 * Ease is ease-out and slower; Emphatic is ease-in-out and faster; Springy is the spring.
 */
export const MOTION_STYLES = {
  none: { label: "None", curve: null, spring: null, duration: TIMING.instant },
  ease: { label: "Ease", curve: EASING["ease-out"].normal, spring: null, duration: TIMING.long },
  emphatic: { label: "Emphatic", curve: EASING["ease-in-out"].normal, spring: null, duration: TIMING.faster },
  // a spring has no curve; the one here is what CSS gets, where a spring cannot run
  springy: { label: "Springy", curve: EASING["ease-out"].normal, spring: SPRING.normal, duration: TIMING.long },
} as const

/** Page-transition speeds, from the Figma's timings. */
export const TRANSITION_SPEEDS = { slow: TIMING.longer, medium: TIMING.long, fast: TIMING.faster } as const

/** Every token as the CSS custom properties tokens.css declares them, name → value. */
export function motionCssTokens(): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [group, strengths] of Object.entries(EASING)) {
    for (const [strength, b] of Object.entries(strengths)) out[`--${group}-${strength}`] = cubicBezier(b)
  }
  for (const [name, bounce] of Object.entries(SPRING)) out[`--spring-bounce-${name}`] = String(bounce)
  for (const [name, s] of Object.entries(TIMING)) out[`--duration-${name}`] = `${s}s`
  out["--ease-hold"] = cubicBezier(HOLD)
  out["--ease-constant"] = "linear"
  return out
}

/**
 * A spring as a CSS easing, for places that cannot run a spring (a transition, a preview). An
 * under-damped spring with the Figma's bounce, sampled into a `linear()` list that settles by
 * `duration` seconds. Bounce 0 is critically damped (no overshoot); more bounce, more overshoot.
 */
export function springEasing(bounce: number, duration: number, points = 48): string {
  const damping = Math.max(0.05, 1 - bounce)
  // settle (to 1%) in `duration`
  const omega = Math.log(100) / (damping * Math.max(duration, 0.05))
  const wd = omega * Math.sqrt(1 - Math.min(damping, 0.999) ** 2)
  const at = (t: number) =>
    1 - Math.exp(-damping * omega * t) * (Math.cos(wd * t) + ((damping * omega) / wd) * Math.sin(wd * t))
  const samples = Array.from({ length: points + 1 }, (_, i) => {
    const v = i === points ? 1 : at((i / points) * duration)
    return Number(v.toFixed(4))
  })
  return `linear(${samples.join(", ")})`
}
