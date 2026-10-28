import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react"
import { MetalFx as MetalFxV1 } from "metal-fx"
import { MetalFx as MetalFxV2 } from "metal-fx-v2"

import { cn } from "@workspace/ui/lib/utils"
import { observeTheme } from "@workspace/ui/lib/observe-theme"
import { SurfaceFill } from "@workspace/ui/components/themed-surface"

/**
 * A liquid-metal ring around a single control (metal-fx, the libraries.dev "Metal" effect), or the
 * quiet glass surface the control sits on when it isn't active.
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
  /** Fill the control from the theme's texture and colour (see SurfaceFill) instead of the plain glass tint. */
  themedFill?: boolean
  /** Ring thickness in CSS px; the engine's own default when omitted (v1 only). */
  ringWidth?: number
  /** The metal fills the whole control instead of ringing it, at a strength that keeps the content readable. v1 has no mask, so give it a `ringWidth` of half the control's height: a ring as thick as the control. */
  filled?: boolean
}

// The surface, quiet or active: glass, not a solid fill. A translucent tint of the theme's foreground
// colour over a soft blur, with the text in that same foreground, so whatever is behind shows through and the
// ring reads against it. `!` because metal-fx injects its own (unlayered) surface styles, which would
// otherwise win over the utility layer.
/** The same, with the fill left to the theme: the root is clear and the texture sits behind it. */
const THEMED_SURFACE = cn(
  "rounded-(--radius) bg-transparent!",
  "hover:bg-(--control-hover)!",
  "text-foreground! data-[quiet]:after:shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--foreground)_10%,transparent)]!",
  "[&[data-quiet]_.metal-fx-inner]:shadow-none!",
  // `!` because metal-fx sets its own transition inline, for its reveal
  "transition-[background-color]! duration-(--motion-fast)! ease-(--motion-transition-ease)!"
)

const SURFACE = cn(
  "rounded-(--radius)",
  "bg-[color-mix(in_srgb,var(--foreground)_8%,transparent)]! backdrop-blur-md",
  "hover:bg-[color-mix(in_srgb,var(--foreground)_12%,transparent)]!",
  "text-foreground! data-[quiet]:after:shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--foreground)_10%,transparent)]!",
  "[&[data-quiet]_.metal-fx-inner]:shadow-none!",
  "transition-colors"
)

/** The metal's strength when it fills the control: low enough that the icon or label on it stays readable. */
const FILLED_STRENGTH = 0.5

/** The theme in force at an element: its CSS `color-scheme` (every theme sets one), else the `.dark` class. */
function readTheme(el: Element | null): MetalTheme {
  if (typeof document === "undefined") return "dark"
  const scheme = getComputedStyle(el ?? document.documentElement).colorScheme
  if (scheme.includes("dark")) return "dark"
  if (scheme.includes("light")) return "light"
  return document.documentElement.classList.contains("dark") ? "dark" : "light"
}

/**
 * The light/dark theme where `ref` sits, kept in sync as the page's theme class changes and read
 * again on every render, so an ancestor that wears its own theme (a scoped preview) is followed too.
 * Themes are named classes (`.berghain`), not `.dark`, so the class alone says nothing about them.
 */
function useScopedTheme(ref: RefObject<Element | null>): MetalTheme {
  const [theme, setTheme] = useState<MetalTheme>(() => readTheme(null))
  useLayoutEffect(() => {
    const next = readTheme(ref.current)
    if (next !== theme) setTheme(next)
  })
  useEffect(() => observeTheme(ref.current, () => setTheme(readTheme(ref.current))), [ref])
  return theme
}

/** The document's light/dark theme, kept in sync with its theme class. */
function useDocumentTheme(): MetalTheme {
  return useScopedTheme({ current: typeof document === "undefined" ? null : document.documentElement })
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
  themedFill = false,
  ringWidth,
  filled = false,
}: MetalSurfaceProps) {
  const anchor = useRef<HTMLSpanElement>(null)
  const scopedTheme = useScopedTheme(anchor)
  // the ring takes its corner from the host's radius once, when it starts, so a theme with another
  // radius starts it again
  const [radius, setRadius] = useState<string | null>(null)
  useLayoutEffect(() => {
    const next = anchor.current ? getComputedStyle(anchor.current).getPropertyValue("--radius").trim() : ""
    if (next !== radius) setRadius(next)
  })
  useEffect(
    () => observeTheme(anchor.current, () => setRadius(getComputedStyle(anchor.current!).getPropertyValue("--radius").trim())),
    []
  )
  // v2 fills through a mask: the whole box in the host's corner. v1 has no mask, so it gets a ring as thick as the control (see `filled`)
  const fillMask = (ctx: CanvasRenderingContext2D, w: number, h: number, dpr: number) => {
    const r = Math.min((parseFloat(radius ?? "") || 0) * dpr, w / 2, h / 2)
    ctx.fillStyle = "#000"
    ctx.beginPath()
    ctx.roundRect(0, 0, w, h, r)
    ctx.fill()
  }
  const MetalFx = engine === "v2" ? MetalFxV2 : MetalFxV1
  // nothing starts until the radius is known, so the effect mounts once instead of once to be thrown away
  const surface = radius === null ? null : (
    <MetalFx
      key={radius}
      {...(engine === "v1" && ringWidth !== undefined ? { ringCssPx: ringWidth } : {})}
      {...(engine === "v2" && filled ? { mask: fillMask, glowMode: "ring" as const } : {})}
      variant={variant}
      preset={preset}
      strength={active ? (filled ? Math.min(strength, FILLED_STRENGTH) : strength) : 0}
      theme={theme ?? scopedTheme}
      disableGlow={!active || !halo}
      reflectionTargets={active ? reflectionTargets : undefined}
      className={cn(themedFill ? THEMED_SURFACE : SURFACE, className)}
      data-slot="metal-surface"
      data-quiet={active ? undefined : "true"}
    >
      {children}
    </MetalFx>
  )
  return (
    <>
      <span ref={anchor} hidden />
      {themedFill ? (
        <span className={cn("relative isolate inline-flex", variant === "circle" ? "rounded-full" : "rounded-(--radius)")}>
          <SurfaceFill />
          {surface}
        </span>
      ) : (
        surface
      )}
    </>
  )
}

export { MetalSurface, useDocumentTheme }
export type { MetalSurfaceProps, MetalEngine }
