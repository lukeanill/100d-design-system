"use client"

// The quietest page transition: a solid panel fades up over the page, the
// content swaps behind it, and it fades away — matching motion.dev's
// "Curtains: Fade" example.
//
// Worth reaching for when a sweep would be too much, and the sensible
// substitute when someone has asked their system for reduced motion.

import * as React from "react"
import { motion } from "motion/react"

import { useCurtainSwap } from "@workspace/ui/components/transitions/use-curtain-swap"

const DEFAULT_DURATION = 0.35
const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1]

export interface FadeTransitionProps {
  transitionKey: string
  children: React.ReactNode
  color?: string
  /** Seconds for each half: the fade in, then the fade out. */
  duration?: number
}

export function FadeTransition({
  transitionKey,
  children,
  color = "var(--foreground)",
  duration = DEFAULT_DURATION,
}: FadeTransitionProps) {
  const { scope, displayedChildren } = useCurtainSwap<HTMLDivElement>({
    transitionKey,
    children,
    duration,
    async sequence({ animate, scope, swap, settle }) {
      await settle(
        animate(scope.current, { opacity: 1 }, { duration, ease: EASE })
      )
      swap()
      await settle(
        animate(scope.current, { opacity: 0 }, { duration, ease: EASE })
      )
    },
  })

  return (
    <>
      {displayedChildren}
      <motion.div
        ref={scope}
        className="pointer-events-none fixed inset-0 z-[9999]"
        style={{ background: color, opacity: 0 }}
      />
    </>
  )
}
