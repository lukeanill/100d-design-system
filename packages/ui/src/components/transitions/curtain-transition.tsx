import * as React from "react"
import { motion, useAnimate } from "motion/react"

// A "curtains" page transition, hand-built with plain motion primitives
// (no Motion+): the outgoing page is covered by a wipe, content swaps
// underneath while fully covered, then the incoming page is revealed by
// an iris (shrinking circle clip-path) — matching motion.dev's
// "Curtains: Mixed effects" example (wipe cover -> iris reveal).
//
// The panel is fixed to the viewport, so this covers the whole page.
// StepCurtain is the scoped sibling, for moving between steps inside one
// page without disturbing the chrome around them.

const DEFAULT_DURATION = 0.55
const EASE: [number, number, number, number] = [0.65, 0, 0.35, 1]
const FULL_CIRCLE = "circle(150% at 50% 50%)"
const ZERO_CIRCLE = "circle(0% at 50% 50%)"

// Backgrounded/hidden tabs can throttle animation frames enough that a
// motion `animate()` promise never resolves, which would otherwise hang
// this transition (and the page swap it gates) forever. A timeout floor
// guarantees the sequence always proceeds even if the animation stalls.
function withTimeout(
  controls: { then: (onResolve: () => void) => void },
  ms: number
): Promise<void> {
  return Promise.race([
    new Promise<void>((resolve) => controls.then(resolve)),
    new Promise<void>((resolve) => setTimeout(resolve, ms)),
  ])
}

interface CurtainTransitionProps {
  transitionKey: string
  children: React.ReactNode
  color?: string
  /** Seconds for each half: the wipe in, then the iris out. */
  duration?: number
}

export function CurtainTransition({
  transitionKey,
  children,
  color = "var(--foreground)",
  duration = DEFAULT_DURATION,
}: CurtainTransitionProps) {
  const [scope, animate] = useAnimate()
  const [displayedKey, setDisplayedKey] = React.useState(transitionKey)
  const [displayedChildren, setDisplayedChildren] = React.useState(children)
  const pendingChildrenRef = React.useRef(children)
  const runningRef = React.useRef(false)

  React.useEffect(() => {
    pendingChildrenRef.current = children
  })

  React.useEffect(() => {
    if (transitionKey === displayedKey || runningRef.current) return
    runningRef.current = true

    async function run() {
      const timeoutMs = duration * 1000 + 200
      // Cover: wipe the solid panel in from the left.
      await withTimeout(
        animate(
          scope.current,
          { scaleX: 1, clipPath: FULL_CIRCLE },
          { duration, ease: EASE }
        ),
        timeoutMs
      )
      // Swap content underneath while fully covered.
      setDisplayedChildren(pendingChildrenRef.current)
      setDisplayedKey(transitionKey)
      // Reveal: iris the panel away from the center.
      await withTimeout(
        animate(
          scope.current,
          { clipPath: ZERO_CIRCLE },
          { duration, ease: EASE }
        ),
        timeoutMs
      )
      // Reset instantly for the next transition.
      await withTimeout(
        animate(
          scope.current,
          { scaleX: 0, clipPath: FULL_CIRCLE },
          { duration: 0 }
        ),
        200
      )
      runningRef.current = false
    }

    run()
  }, [transitionKey, displayedKey, animate, scope, duration])

  React.useEffect(() => {
    if (transitionKey === displayedKey && !runningRef.current) {
      setDisplayedChildren(children)
    }
  }, [children, transitionKey, displayedKey])

  return (
    <>
      {displayedChildren}
      <motion.div
        ref={scope}
        className="pointer-events-none fixed inset-0 z-[9999]"
        style={{
          background: color,
          transformOrigin: "left",
          scaleX: 0,
          clipPath: FULL_CIRCLE,
        }}
      />
    </>
  )
}
