"use client"

// Horizontal strips close over the page one after another, the content swaps
// behind them, then they open again — matching motion.dev's "Curtains: Blinds"
// example.
//
// Each strip scales from its own edge, alternating top and bottom, which is
// what gives the slatted look rather than one solid block arriving.

import * as React from "react"
import { motion, stagger } from "motion/react"

import { useCurtainSwap } from "@workspace/ui/components/transitions/use-curtain-swap"

const DEFAULT_DURATION = 0.45
const DEFAULT_STRIPS = 6
const EASE: [number, number, number, number] = [0.65, 0, 0.35, 1]
// Strips overlap rather than run in series, so the whole sweep stays close to
// `duration` however many there are.
const STAGGER_FRACTION = 0.5

export interface BlindsTransitionProps {
  transitionKey: string
  children: React.ReactNode
  color?: string
  /** Seconds for each half: closing, then opening. */
  duration?: number
  /** How many strips the page is divided into. */
  strips?: number
}

export function BlindsTransition({
  transitionKey,
  children,
  color = "var(--foreground)",
  duration = DEFAULT_DURATION,
  strips = DEFAULT_STRIPS,
}: BlindsTransitionProps) {
  const stripDelay = (duration * STAGGER_FRACTION) / Math.max(strips, 1)

  const { scope, displayedChildren } = useCurtainSwap<HTMLDivElement>({
    transitionKey,
    children,
    duration,
    async sequence({ animate, swap, settle }) {
      // The sequence runs a little past `duration` because the last strip
      // starts late, so the settle floor has to allow for the stagger too.
      const floor = (duration * (1 + STAGGER_FRACTION) + 0.2) * 1000
      await settle(
        animate(
          ".curtain-blind",
          { scaleY: 1 },
          { duration, ease: EASE, delay: stagger(stripDelay) }
        ),
        floor
      )
      swap()
      await settle(
        animate(
          ".curtain-blind",
          { scaleY: 0 },
          { duration, ease: EASE, delay: stagger(stripDelay) }
        ),
        floor
      )
    },
  })

  return (
    <>
      {displayedChildren}
      <div
        ref={scope}
        className="pointer-events-none fixed inset-0 z-[9999] flex flex-col"
      >
        {Array.from({ length: strips }, (_, i) => (
          <motion.div
            key={i}
            className="curtain-blind flex-1"
            style={{
              background: color,
              scaleY: 0,
              // Alternating origins make the strips meet rather than march.
              transformOrigin: i % 2 === 0 ? "top" : "bottom",
            }}
          />
        ))}
      </div>
    </>
  )
}
