"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import { colorThemes, type PageTransitionId } from "@workspace/ui/lib/theme-registry"
import { BlindsTransition } from "@workspace/ui/components/transitions/blinds-transition"
import { CurtainTransition } from "@workspace/ui/components/transitions/curtain-transition"
import { FadeTransition } from "@workspace/ui/components/transitions/fade-transition"
import { IrisTransition } from "@workspace/ui/components/transitions/iris-transition"

/**
 * The page transition a theme brings with it.
 *
 * All four take the same `transitionKey` + `children`, so choosing one is a
 * lookup. A theme that chose none renders its children unwrapped rather than
 * through a transition set to zero: the swap components hold the outgoing page
 * in state while covered, and a page that is never covered should never be held.
 *
 * Step Curtain is deliberately absent — it is the scoped sibling for moving
 * between steps inside a page, not a page transition.
 */
const TRANSITIONS = {
  fade: FadeTransition,
  blinds: BlindsTransition,
  curtain: CurtainTransition,
  iris: IrisTransition,
} satisfies Record<PageTransitionId, React.ComponentType<TransitionProps>>

type TransitionProps = {
  transitionKey: string
  children: React.ReactNode
  color?: string
  duration?: number
}

function usePrefersReducedMotion() {
  const query = "(prefers-reduced-motion: reduce)"
  const subscribe = React.useCallback((notify: () => void) => {
    if (typeof window.matchMedia !== "function") return () => {}
    const media = window.matchMedia(query)
    media.addEventListener("change", notify)
    return () => media.removeEventListener("change", notify)
  }, [])
  return React.useSyncExternalStore(
    subscribe,
    () => typeof window.matchMedia === "function" && window.matchMedia(query).matches,
    () => false
  )
}

export function ThemePageTransition({
  transitionKey,
  children,
  transition,
  ...props
}: Omit<TransitionProps, "children"> & {
  children: React.ReactNode
  /** Overrides the active theme's choice — for stories and previews. */
  transition?: PageTransitionId | "none"
}) {
  const { resolvedTheme, forcedTheme } = useTheme()
  const reducedMotion = usePrefersReducedMotion()
  const themed = colorThemes.find((t) => t.id === (forcedTheme ?? resolvedTheme))?.pageTransition
  const chosen = transition ?? themed

  // Asked for less motion, so the page simply changes.
  if (reducedMotion || !chosen || chosen === "none") return <>{children}</>

  const Transition = TRANSITIONS[chosen]
  if (!Transition) return <>{children}</>
  return (
    <Transition transitionKey={transitionKey} {...props}>
      {children}
    </Transition>
  )
}
