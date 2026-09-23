"use client"

// A circle opens out from a point until it covers the page, the content swaps
// behind it, then it closes back to that point — matching motion.dev's
// "Curtains: Iris" and "Curtains: Iris from click" examples.
//
// Pass `origin` to grow the circle from wherever the person clicked, which is
// what ties the transition to their action; leave it out and it runs from the
// centre.

import * as React from "react"
import { motion } from "motion/react"

import { useCurtainSwap } from "@workspace/ui/components/transitions/use-curtain-swap"

const DEFAULT_DURATION = 0.5
const EASE: [number, number, number, number] = [0.65, 0, 0.35, 1]

/** 150% rather than 100%: the circle has to clear the far corner from any origin. */
const COVERED = 150
const CLOSED = 0

export interface IrisTransitionProps {
  transitionKey: string
  children: React.ReactNode
  color?: string
  /** Seconds for each half: opening, then closing. */
  duration?: number
  /**
   * Viewport coordinates to grow from, e.g. a click's clientX/clientY.
   * Defaults to the centre of the page.
   */
  origin?: { x: number; y: number } | null
}

function circle(radius: number, origin: IrisTransitionProps["origin"]) {
  const at = origin ? `${origin.x}px ${origin.y}px` : "50% 50%"
  return `circle(${radius}% at ${at})`
}

export function IrisTransition({
  transitionKey,
  children,
  color = "var(--foreground)",
  duration = DEFAULT_DURATION,
  origin = null,
}: IrisTransitionProps) {
  // Read at sequence time, so a click updates the origin for its own run.
  const originRef = React.useRef(origin)
  React.useEffect(() => {
    originRef.current = origin
  })

  const { scope, displayedChildren } = useCurtainSwap<HTMLDivElement>({
    transitionKey,
    children,
    duration,
    async sequence({ animate, scope, swap, settle }) {
      const at = originRef.current
      await settle(
        animate(
          scope.current,
          { clipPath: [circle(CLOSED, at), circle(COVERED, at)] },
          { duration, ease: EASE }
        )
      )
      swap()
      await settle(
        animate(
          scope.current,
          { clipPath: circle(CLOSED, at) },
          { duration, ease: EASE }
        )
      )
    },
  })

  return (
    <>
      {displayedChildren}
      <motion.div
        ref={scope}
        className="pointer-events-none fixed inset-0 z-[9999]"
        style={{ background: color, clipPath: circle(CLOSED, origin) }}
      />
    </>
  )
}
