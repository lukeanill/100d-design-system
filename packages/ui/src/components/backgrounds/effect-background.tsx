"use client"

import * as React from "react"

import { cn } from "@workspace/ui/lib/utils"
import { useThemeColors } from "./theme-colors"

/**
 * The frame every animated background effect sits in, so they all take the same args as the gradient
 * backgrounds (Animation / Backgrounds / FX): `paused`, `useThemeColors`, `inverse` and `scrim`.
 *
 * It owns what is the same for every effect: the layer (decorative, transparent to the pointer, behind
 * content in a `relative isolate` parent), the colours (the effect's own, or the active theme's when
 * `useThemeColors` is set, swapped by `inverse`), the scrim over the top, and whether the effect should be
 * running at all. An effect is given `colors` and `running` and draws into the box it is placed in.
 *
 * `colors` are hex strings, at least two, ordered by role: the base first (the theme's background, or its
 * foreground when `inverse`), then muted, secondary and accent, and the highlight last (the theme's
 * primary, or its background when `inverse`). An effect that takes one colour uses `colors[0]` for its
 * base and `colors[colors.length - 1]` for its highlight.
 *
 * `running` is false when the effect is `paused`, when the person prefers reduced motion, when the tab is
 * hidden and when the box is scrolled out of view. An effect holds its current frame (it does not need to
 * draw again) while `running` is false and stops its animation loop.
 */
export interface EffectBackgroundProps {
  /** Hold the current frame. */
  paused?: boolean
  /** Paint with the active theme's colours instead of the effect's own (switch themes in the toolbar). */
  useThemeColors?: boolean
  /** Swap base and highlight: the theme's background and foreground with `useThemeColors` (set `scrimColor` to the foreground to match), or the effect's own first and last colours without it. */
  inverse?: boolean
  /** Lay a colour over the effect for legibility: 0 to 1, or true for 0.65. */
  scrim?: boolean | number
  /** The scrim's colour, the page background by default. */
  scrimColor?: string
  className?: string
}

export interface EffectContext {
  /** Hex colours, at least two, base first and highlight last. */
  colors: string[]
  /** False while the effect should hold still. */
  running: boolean
}

const DEFAULT_SCRIM = 0.65

/** Whether the effect should animate: not paused, no reduced-motion preference, tab visible, box on screen. */
function useRunning(ref: React.RefObject<HTMLElement | null>, paused: boolean) {
  const [reduced, setReduced] = React.useState(false)
  const [visible, setVisible] = React.useState(true)
  const [inView, setInView] = React.useState(true)

  React.useEffect(() => {
    const query = typeof window.matchMedia === "function" ? window.matchMedia("(prefers-reduced-motion: reduce)") : undefined
    const onMotion = () => setReduced(Boolean(query?.matches))
    onMotion()
    query?.addEventListener("change", onMotion)
    const onVisibility = () => setVisible(document.visibilityState !== "hidden")
    onVisibility()
    document.addEventListener("visibilitychange", onVisibility)
    const element = ref.current
    const observer =
      typeof IntersectionObserver !== "undefined" && element
        ? new IntersectionObserver(([entry]) => setInView(entry?.isIntersecting ?? true), { rootMargin: "96px" })
        : undefined
    if (element) observer?.observe(element)
    return () => {
      query?.removeEventListener("change", onMotion)
      document.removeEventListener("visibilitychange", onVisibility)
      observer?.disconnect()
    }
  }, [ref])

  return !paused && !reduced && visible && inView
}

export function EffectBackground({
  colors: ownColors,
  children,
  paused = false,
  useThemeColors: themed = false,
  inverse = false,
  scrim = false,
  scrimColor,
  className,
}: EffectBackgroundProps & {
  /** The effect's own colours, used when `useThemeColors` is off. */
  colors: string[]
  children: (context: EffectContext) => React.ReactNode
}) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const themeColors = useThemeColors(rootRef, themed, inverse)
  // `inverse` swaps the roles of base and highlight: the theme's, or the effect's own when it paints with its own colours
  const colors = themeColors ?? (inverse ? [...ownColors].reverse() : ownColors)
  const running = useRunning(rootRef, paused)

  const scrimOpacity =
    scrim === true ? DEFAULT_SCRIM : typeof scrim === "number" && Number.isFinite(scrim) ? Math.min(1, Math.max(0, scrim)) : 0

  return (
    <div
      ref={rootRef}
      data-slot="effect-background"
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 isolate overflow-hidden forced-colors:bg-[Canvas]", className)}
    >
      <div className="absolute inset-0 forced-colors:hidden">{children({ colors, running })}</div>
      {scrimOpacity > 0 && (
        <div
          data-slot="effect-background-scrim"
          className="absolute inset-0"
          style={{ backgroundColor: scrimColor ?? (inverse && themed ? "var(--foreground)" : "var(--background)"), opacity: scrimOpacity }}
        />
      )}
    </div>
  )
}
