import * as React from "react"

import { DEFAULT_THEME_ID, getPreset, presets } from "@workspace/ui/themes/presets"
import { googleFontsHref } from "@workspace/ui/themes/fonts"
import { themeFamilies, themeToCss } from "@workspace/ui/themes/css"
import { startGlassRefraction } from "@workspace/ui/lib/glass-refraction"

const STORAGE_KEY = "theme"
const STYLE_ID = "ui-theme-presets"
const FONTS_ID = "ui-theme-fonts"

/**
 * The nine presets as CSS, plus the Google fonts they name. Written once, into
 * the document head, the first time a provider renders: every theme is already
 * on the page, so switching one is only a class on <html>.
 */
function installPresets() {
  if (typeof document === "undefined" || document.getElementById(STYLE_ID)) return
  const style = document.createElement("style")
  style.id = STYLE_ID
  style.textContent = presets.map((t) => themeToCss(t, { asDefault: t.id === DEFAULT_THEME_ID })).join("\n")
  document.head.append(style)

  const href = googleFontsHref(presets.flatMap(themeFamilies))
  if (href && !document.getElementById(FONTS_ID)) {
    const link = document.createElement("link")
    link.id = FONTS_ID
    link.rel = "stylesheet"
    link.href = href
    document.head.append(link)
  }
}

interface ThemeContextValue {
  /** The id of the theme in effect: the forced one when there is one. */
  theme: string
  /** Same as `theme`, kept as an alias for code that reads either name. */
  resolvedTheme: string
  forcedTheme?: string
  setTheme: (id: string) => void
  themes: string[]
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null)

export function useTheme(): ThemeContextValue {
  const value = React.useContext(ThemeContext)
  if (!value) throw new Error("useTheme must be used inside a ThemeProvider")
  return value
}

function readStored(fallback: string) {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored && getPreset(stored) ? stored : fallback
  } catch {
    return fallback
  }
}

/**
 * Applies a theme as a class on <html>. `forcedTheme` wins over the visitor's
 * choice and is how a page pins itself to one look. A theme that is not one of
 * the presets (a downloaded theme file, imported by the app) works the same
 * way: pass its id as `forcedTheme` or `defaultTheme`.
 */
export function ThemeProvider({
  children,
  forcedTheme,
  defaultTheme = DEFAULT_THEME_ID,
}: {
  children: React.ReactNode
  forcedTheme?: string
  defaultTheme?: string
}) {
  installPresets()
  const [chosen, setChosen] = React.useState(() => (typeof window === "undefined" ? defaultTheme : readStored(defaultTheme)))
  const active = forcedTheme ?? chosen

  const previous = React.useRef<string | null>(null)
  React.useLayoutEffect(() => {
    const root = document.documentElement
    if (previous.current) root.classList.remove(previous.current)
    root.classList.add(active)
    root.dataset.theme = active
    previous.current = active
  }, [active])

  React.useEffect(() => startGlassRefraction(), [])

  const setTheme = React.useCallback((id: string) => {
    setChosen(id)
    try {
      window.localStorage.setItem(STORAGE_KEY, id)
    } catch {
      /* private mode: the choice just lasts for the session */
    }
  }, [])

  const value = React.useMemo<ThemeContextValue>(
    () => ({ theme: active, resolvedTheme: active, forcedTheme, setTheme, themes: presets.map((t) => t.id) }),
    [active, forcedTheme, setTheme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
