import * as React from "react"
import { useTheme } from "next-themes"
import { colorThemes } from "@workspace/ui/lib/theme-registry"
import type { FontThemeId } from "@workspace/ui/lib/font-theme-registry"

const DEFAULT_FONT_THEME: FontThemeId = "chill-light"

function fontThemeForColorTheme(colorThemeId: string | undefined): FontThemeId {
  return colorThemes.find((t) => t.id === colorThemeId)?.fontTheme ?? DEFAULT_FONT_THEME
}

/**
 * Derives `data-font-theme` on <html> from the active color theme — each color theme has exactly
 * one font pairing (see theme-registry.ts), so fonts are never chosen independently of color.
 */
export function FontThemeProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme, forcedTheme } = useTheme()
  const fontTheme = fontThemeForColorTheme(forcedTheme ?? resolvedTheme)

  React.useEffect(() => {
    document.documentElement.setAttribute("data-font-theme", fontTheme)
  }, [fontTheme])

  return <>{children}</>
}
