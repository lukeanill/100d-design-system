// The faces a theme can name. Google families load from Google Fonts; the
// bundled ones ship as @font-face in the package's own stylesheet.

export interface FontChoice {
  family: string
  source: "google" | "bundled"
  kind: "sans" | "serif" | "mono" | "display"
  /** Weights the family actually has. */
  weights: number[]
}

const g = (family: string, kind: FontChoice["kind"], weights: number[]): FontChoice => ({ family, source: "google", kind, weights })
const b = (family: string, kind: FontChoice["kind"], weights: number[]): FontChoice => ({ family, source: "bundled", kind, weights })

export const FONT_CHOICES: FontChoice[] = [
  b("Akkurat LL TT", "sans", [200, 300, 400, 500, 600, 700]),
  b("Folio Std", "sans", [700]),
  b("ITC Garamond Std", "serif", [800]),
  b("PP Editorial New", "serif", [400]),
  b("GT Pressura Mono Trial", "mono", [400, 700]),
  b("Intan", "display", [400]),
  b("Khaviax", "display", [400]),
  b("Swear Display Demo", "display", [500]),
  b("Imbue", "serif", [100, 200, 300, 400, 500, 600, 700, 800, 900]),
  b("Migra", "serif", [200, 800]),
  g("Archivo", "sans", [300, 400, 500, 600, 700, 800]),
  g("Bricolage Grotesque", "sans", [300, 400, 500, 600, 700, 800]),
  g("DM Sans", "sans", [300, 400, 500, 600, 700, 800]),
  g("Inter", "sans", [300, 400, 500, 600, 700, 800]),
  g("Karla", "sans", [300, 400, 500, 600, 700, 800]),
  g("Manrope", "sans", [300, 400, 500, 600, 700, 800]),
  g("Plus Jakarta Sans", "sans", [300, 400, 500, 600, 700, 800]),
  g("Work Sans", "sans", [300, 400, 500, 600, 700, 800]),
  g("Space Grotesk", "sans", [300, 400, 500, 600, 700]),
  g("DM Serif Display", "serif", [400]),
  g("EB Garamond", "serif", [400, 500, 600, 700, 800]),
  g("Gloock", "serif", [400]),
  g("Instrument Serif", "serif", [400]),
  g("Lora", "serif", [400, 500, 600, 700]),
  g("Newsreader", "serif", [300, 400, 500, 600, 700, 800]),
  g("Playfair Display", "serif", [400, 500, 600, 700, 800]),
  g("Fraunces", "serif", [300, 400, 500, 600, 700, 800]),
  g("Space Mono", "mono", [400, 700]),
  g("JetBrains Mono", "mono", [300, 400, 500, 600, 700, 800]),
]

export const fontChoice = (family: string) => FONT_CHOICES.find((f) => f.family === family)

/** The weight a family offers closest to the one asked for. */
export function nearestWeight(family: string, weight: number) {
  const weights = fontChoice(family)?.weights
  if (!weights?.length) return weight
  return weights.reduce((best, w) => (Math.abs(w - weight) < Math.abs(best - weight) ? w : best), weights[0])
}

/** One stylesheet URL for the Google families in use, or null when there are none. */
export function googleFontsHref(families: { family: string; weights?: number[] }[]) {
  const parts: string[] = []
  const seen = new Set<string>()
  for (const { family, weights } of families) {
    const choice = fontChoice(family)
    // an unknown family is assumed to be Google's: the user typed it in
    if (choice && choice.source !== "google") continue
    if (seen.has(family)) continue
    seen.add(family)
    const w = (weights?.length ? weights : choice?.weights ?? [400]).slice().sort((x, y) => x - y)
    parts.push(`family=${family.replace(/ /g, "+")}:wght@${w.join(";")}`)
  }
  return parts.length ? `https://fonts.googleapis.com/css2?${parts.join("&")}&display=swap` : null
}
