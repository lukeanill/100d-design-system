// Colour maths for theme output: hex in, oklch out. Pure, no DOM.

export interface Oklch {
  L: number
  C: number
  H: number
}

const cbrt = Math.cbrt

const toLinear = (x: number) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4)

function rgbToOklch([r, g, b]: [number, number, number]): Oklch {
  const [lr, lg, lb] = [toLinear(r), toLinear(g), toLinear(b)]
  const l = cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb)
  const m = cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb)
  const s = cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb)
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  const C = Math.hypot(A, B)
  const H = C < 1e-6 ? 0 : ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360
  return { L, C, H }
}

/** "#rgb" or "#rrggbb", with or without the hash. */
export const isHex = (value: string) => /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value.trim())

export function hexToOklch(hex: string): Oklch {
  const h = hex.replace("#", "").trim()
  const full = h.length === 3 ? [...h].map((c) => c + c).join("") : h
  return rgbToOklch([0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255) as [number, number, number])
}

/** Normalised "#rrggbb" for any value isHex accepts. */
export function normalizeHex(hex: string) {
  const h = hex.replace("#", "").trim().toLowerCase()
  return "#" + (h.length === 3 ? [...h].map((c) => c + c).join("") : h)
}

export const fmt = ({ L, C, H }: Oklch) => `oklch(${L.toFixed(3)} ${C.toFixed(3)} ${H.toFixed(2)})`

/** Any hex as an oklch() string, optionally at an alpha percentage. */
export function oklch(hex: string, alphaPercent?: number) {
  const value = fmt(hexToOklch(hex))
  return alphaPercent === undefined ? value : value.replace(")", ` / ${alphaPercent}%)`)
}

/** Lightness 0–1 of a hex colour (oklch L). */
export const lightness = (hex: string) => hexToOklch(hex).L

/** The readable ink for a filled surface: white or near-black, whichever reads better. */
export function onColor(hex: string) {
  return lightness(hex) > 0.62 ? "#0f0e0e" : "#ffffff"
}
