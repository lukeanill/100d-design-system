"use client"

import type { ComponentProps } from "react"
import { ThinkingOrb as Orb } from "thinking-orbs"

import { useDocumentTheme } from "@workspace/ui/components/metal-surface"

/**
 * The thought-orb loading indicator (the `thinking-orbs` library from libraries.dev, MIT): a canvas of dots with
 * nine animated states — working, searching, solving, listening, connecting, weaving, composing, breathing, shaping.
 * `size` is 64 (chat avatar), 32 or 20 (inline with text). It follows the document's light or dark theme unless
 * `theme` is set, so its ink reads on the page.
 */
function ThinkingOrb({ theme, ...props }: ComponentProps<typeof Orb>) {
  const documentTheme = useDocumentTheme()
  return <Orb theme={theme ?? documentTheme} {...props} />
}

export { ThinkingOrb }
