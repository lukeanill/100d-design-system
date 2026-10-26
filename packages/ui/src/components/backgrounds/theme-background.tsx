"use client"

import { GradientBackground } from "@workspace/ui/components/backgrounds/gradient-background"
import type { BalsaBackgroundConfig } from "@workspace/ui/components/backgrounds/gradient-background/gradient-background"
import { animatedBackground80 } from "@workspace/ui/components/backgrounds/gradients/animated-background-80"
import { animatedBackgroundAscii } from "@workspace/ui/components/backgrounds/gradients/animated-background-ascii"
import { animatedBackgroundAurora } from "@workspace/ui/components/backgrounds/gradients/animated-background-aurora"
import { animatedBackgroundHolo } from "@workspace/ui/components/backgrounds/gradients/animated-background-holo"
import { animatedBackgroundSmoke } from "@workspace/ui/components/backgrounds/gradients/animated-background-smoke"

export type ThemeBackgroundId = "smoke" | "holo" | "aurora" | "eighties" | "ascii"

/** The animated backgrounds, by id. */
export const THEME_BACKGROUND_CONFIGS: Record<ThemeBackgroundId, BalsaBackgroundConfig> = {
  smoke: animatedBackgroundSmoke,
  holo: animatedBackgroundHolo,
  aurora: animatedBackgroundAurora,
  eighties: animatedBackground80,
  ascii: animatedBackgroundAscii,
}

/**
 * An animated background behind the whole page.
 *
 * Fixed to the viewport so it stays as the page scrolls, and at z -1 so it
 * paints over the page colour but under everything on it — which means the
 * page needs `relative isolate` for the layering to be its own. No id renders
 * nothing at all.
 */
export function ThemeBackground({ background, className }: { background?: ThemeBackgroundId; className?: string }) {
  const config = background ? THEME_BACKGROUND_CONFIGS[background] : undefined
  if (!config) return null

  return (
    <div className={className ?? "pointer-events-none fixed inset-0 -z-10"}>
      <GradientBackground config={config} />
    </div>
  )
}
