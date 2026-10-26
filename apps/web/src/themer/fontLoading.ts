import { FONT_CHOICES, fontChoice, googleFontsHref } from "@workspace/ui/themes"

import { notifyProblem } from "./notify"

let linked: Promise<boolean> | null = null

/** One request for every Google family the pickers offer. Resolves false when it fails. */
export function loadPickerFonts(): Promise<boolean> {
  if (linked) return linked
  const href = googleFontsHref(FONT_CHOICES.filter((f) => f.source === "google").map((f) => ({ family: f.family })))
  if (!href) return (linked = Promise.resolve(true))
  linked = new Promise<boolean>((resolve) => {
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = href
    link.onload = () => resolve(true)
    link.onerror = () => resolve(false)
    document.head.append(link)
  })
  return linked
}

/** Tell the person when a chosen font could not be loaded, and what the preview does instead. */
export async function checkFont(family: string, weight: number) {
  const choice = fontChoice(family)
  const ok = await loadPickerFonts()
  if (choice?.source === "google" && !ok) {
    notifyProblem({
      title: `Couldn't reach Google Fonts for ${family}`,
      now: "The preview is using a fallback font, and the code still names " + family + ".",
      next: "Check your connection, then pick the font again.",
    })
    return
  }
  try {
    const faces = await Promise.race([
      document.fonts.load(`${weight} 16px "${family}"`),
      new Promise<FontFace[]>((r) => setTimeout(() => r([]), 6000)),
    ])
    if (faces.length === 0) {
      notifyProblem({
        title: `${family} didn't load`,
        now: "The preview is using a fallback font, and the code still names " + family + ".",
        next: "Pick the font again, or choose another one.",
      })
    }
  } catch {
    notifyProblem({
      title: `${family} didn't load`,
      now: "The preview is using a fallback font, and the code still names " + family + ".",
      next: "Pick the font again, or choose another one.",
    })
  }
}
