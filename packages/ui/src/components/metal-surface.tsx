import { useEffect, useState, type ReactNode, type RefObject } from "react"
import { MetalFx as MetalFxV1 } from "metal-fx"
import { MetalFx as MetalFxV2 } from "metal-fx-v2"

import { cn } from "@workspace/ui/lib/utils"

/**
 * A liquid-metal ring around a single control (metal-fx, the libraries.dev "Metal" effect), or the
 * quiet solid surface the control sits on when it isn't active.
 *
 * The metal-fx instance stays mounted and only its strength changes, so switching `active` never
 * remounts the wrapped element (an input keeps focus, a menu trigger keeps its popover). The wrapped
 * host should be transparent — the surface is this wrapper's.
 *
 * - `engine`: "v1" (the original shader, the default) or "v2" (Paper Shaders liquidMetal).
 * - `variant`: "circle" for round controls, "button" for pills and groups.
 * - `halo`: the wandering halo around the ring (only while active).
 * - `theme`: follows the document's `.dark` class unless set.
 *
 * Without WebGL2 the host renders plainly. Note: metal-fx only reveals itself after its first
 * painted frame, which React StrictMode's dev-only double mount can swallow for controls that
 * mount after load.
 */
type MetalEngine = "v1" | "v2"
type MetalTheme = "light" | "dark"

type MetalSurfaceProps = {
  children: ReactNode
  active?: boolean
  halo?: boolean
  variant?: "circle" | "button"
  engine?: MetalEngine
  preset?: "chromatic" | "silver" | "gold"
  theme?: MetalTheme
  strength?: number
  className?: string
  /** Neighbours that catch a soft reflection of the ring (dark theme only). */
  reflectionTargets?: ReadonlyArray<RefObject<HTMLElement | null>>
}

// The quiet surface: solid, with a hairline rim. `!` because metal-fx injects its own
// (unlayered) surface styles, which would otherwise win over the utility layer.
const QUIET_SURFACE = cn(
  "data-[quiet]:bg-white! data-[quiet]:text-[#1d1d1d]! data-[quiet]:after:shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]!",
  "dark:data-[quiet]:bg-[#1d1d1d]! dark:data-[quiet]:text-[#f8f8f8]! dark:data-[quiet]:after:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]!",
  "data-[quiet]:hover:bg-[#f4f4f4]! dark:data-[quiet]:hover:bg-[#242424]!",
  "[&[data-quiet]_.metal-fx-inner]:shadow-none!",
  "transition-colors"
)

function readDocumentTheme(): MetalTheme {
  if (typeof document === "undefined") return "dark"
  return document.documentElement.classList.contains("dark") ? "dark" : "light"
}

/** The document's light/dark theme, kept in sync with its `.dark` class. */
function useDocumentTheme(): MetalTheme {
  const [theme, setTheme] = useState<MetalTheme>(readDocumentTheme)
  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(readDocumentTheme()))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])
  return theme
}

function MetalSurface({
  children,
  active = true,
  halo = false,
  variant = "circle",
  engine = "v1",
  preset = "chromatic",
  theme,
  strength = 0.9,
  className,
  reflectionTargets,
}: MetalSurfaceProps) {
  const documentTheme = useDocumentTheme()
  const MetalFx = engine === "v2" ? MetalFxV2 : MetalFxV1
  return (
    <MetalFx
      variant={variant}
      preset={preset}
      strength={active ? strength : 0}
      theme={theme ?? documentTheme}
      disableGlow={!active || !halo}
      reflectionTargets={active ? reflectionTargets : undefined}
      className={cn(QUIET_SURFACE, className)}
      data-slot="metal-surface"
      data-quiet={active ? undefined : "true"}
    >
      {children}
    </MetalFx>
  )
}

export { MetalSurface, useDocumentTheme }
export type { MetalSurfaceProps, MetalEngine }
