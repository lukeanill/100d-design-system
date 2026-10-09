import * as React from "react"
import { ThemeProvider as NextThemeProvider, useTheme } from "next-themes"
import { colorThemeIds } from "@workspace/ui/lib/theme-registry"
import { startGlassRefraction } from "@workspace/ui/lib/glass-refraction"

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  if (target.isContentEditable) {
    return true
  }

  return !!target.closest("input, textarea, select, [contenteditable='true']")
}

function KeyboardThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (isEditableTarget(event.target)) return
      if (event.key.toLowerCase() !== "d") return

      setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [resolvedTheme, setTheme])

  return null
}

/** Refraction for the large glass surfaces of a theme that opts in. */
function GlassRefraction() {
  React.useEffect(() => startGlassRefraction(), [])
  return null
}

export function ThemeProvider({
  children,
  forcedTheme,
}: {
  children: React.ReactNode
  forcedTheme?: string
}) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      themes={colorThemeIds}
      forcedTheme={forcedTheme}
    >
      <KeyboardThemeToggle />
      <GlassRefraction />
      {children}
    </NextThemeProvider>
  )
}
