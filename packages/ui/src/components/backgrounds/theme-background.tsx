"use client"

import { useTheme } from "next-themes"

import { colorThemes, type ThemeBackgroundId } from "@workspace/ui/lib/theme-registry"
import { GradientBackground } from "@workspace/ui/components/backgrounds/gradient-background"
import type { BalsaBackgroundConfig } from "@workspace/ui/components/backgrounds/gradient-background/gradient-background"
import { animatedBackground80 } from "@workspace/ui/components/backgrounds/gradients/animated-background-80"
import { animatedBackgroundAscii } from "@workspace/ui/components/backgrounds/gradients/animated-background-ascii"
import { animatedBackgroundAurora } from "@workspace/ui/components/backgrounds/gradients/animated-background-aurora"
import { animatedBackgroundHolo } from "@workspace/ui/components/backgrounds/gradients/animated-background-holo"
import { animatedBackgroundSmoke } from "@workspace/ui/components/backgrounds/gradients/animated-background-smoke"

/** The backgrounds a theme can choose, by the id stored in the registry. */
export const THEME_BACKGROUND_CONFIGS: Record<ThemeBackgroundId, BalsaBackgroundConfig> = {
  smoke: animatedBackgroundSmoke,
  holo: animatedBackgroundHolo,
  aurora: animatedBackgroundAurora,
  eighties: animatedBackground80,
  ascii: animatedBackgroundAscii,
}

/**
 * The animated background the active theme brings, behind the whole page.
 *
 * Fixed to the viewport so it stays as the page scrolls, and at z -1 so it
 * paints over the page colour but under everything on it — which means the
 * page needs `relative isolate` for the layering to be its own. A theme that
 * chose none renders nothing at all.
 */
export function ThemeBackground({ className }: { className?: string }) {
  const { resolvedTheme, forcedTheme } = useTheme()
  const id = colorThemes.find((t) => t.id === (forcedTheme ?? resolvedTheme))?.background
  const config = id ? THEME_BACKGROUND_CONFIGS[id] : undefined
  if (!config) return null

  return (
    <div className={className ?? "pointer-events-none fixed inset-0 -z-10"}>
      <GradientBackground config={config} />
    </div>
  )
}
