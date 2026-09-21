/**
 * Types for color.mjs.
 *
 * Without these the module imports as `any` everywhere it is used, which is how
 * the studio's edge picker came to preview `strong` at 16px while the tokens
 * said 12px — nothing could tell the two apart.
 */

export type Oklch = { L: number; C: number; H: number }

export type Tokens = Record<string, string>

export type Seeds = {
  background?: string
  foreground?: string
  primary?: string
  secondary?: string
}

export type ContrastRule = {
  fg: string
  bg: string
  min: number
  label: string
}

/** checkContrast spreads the rule it checked, so the pair is on the result. */
export type ContrastResult = ContrastRule & { ratio: number; pass: boolean }

export type DerivedSwatch = { token: string; label: string }

/** Control radius per edge preset — buttons, inputs, tags. */
export declare const EDGES: Record<"square" | "subtle" | "strong" | "round", string>

/** Nearest preset for an existing radius, or "custom" when it matches none. */
export declare const edgesFor: (radius: string) => string

/** The container radius that goes with a control radius: twice it, capped at 32px. */
export declare const containerRadiusFor: (control: string) => string

export declare const CONTRAST_RULES: ContrastRule[]
export declare const DERIVED_SWATCHES: DerivedSwatch[]

export declare const fmt: (color: Oklch) => string
export declare const oklchToHex: (color: Oklch) => string
export declare const onColor: (bg: Oklch) => Oklch

export declare function hexToOklch(hex: string): Oklch
export declare function parseOklch(value: string): Oklch | null
export declare function rgbToOklch(rgb: number[]): Oklch
export declare function oklchToRgb(color: Oklch): number[]

export declare function luminance(rgb: number[]): number
export declare function contrast(a: Oklch, b: Oklch): number
export declare function ensureContrast(color: Oklch, bg: Oklch, target?: number): Oklch
export declare function checkContrast(tokens: Tokens): ContrastResult[]

/** Resolve a token to a colour, following `var(--x)` aliases. */
export declare function resolve(tokens: Tokens, name: string): Oklch | null

export declare function derivePalette(
  input: Seeds & { edges?: string; radius?: string; overrides?: Tokens }
): Tokens
