import * as React from "react"
import { motion, useAnimate } from "motion/react"

import { cn } from "@workspace/ui/lib/utils"

// A scoped curtain transition for moving between steps of a flow, matching
// motion.dev's "Curtains: Scope" example
// (https://examples.motion.dev/react/curtains-scope).
//
// A single panel slides straight across:
//
//   translateX  -100%  ->  0  (covers, content swaps underneath)
//               0      -> +100%  (uncovers, continuing the same direction)
//
// It is scoped to its own container rather than fixed to the viewport, so
// surrounding chrome stays put. CurtainTransition is the full-page sibling,
// with a wipe-and-iris look, for switching between whole pages.
//
// Timings taken from the reference: roughly 0.45s per half, cubic ease-in-out,
// with the swap happening while fully covered.

const DURATION = 0.45
const EASE: [number, number, number, number] = [0.65, 0, 0.35, 1]

// Backgrounded tabs can throttle frames enough that an animate() promise never
// resolves, which would strand the sequence and the page swap it gates.
function withTimeout(
  controls: { then: (onResolve: () => void) => void },
  ms: number
): Promise<void> {
  return Promise.race([
    new Promise<void>((resolve) => controls.then(resolve)),
    new Promise<void>((resolve) => setTimeout(resolve, ms)),
  ])
}

interface StepCurtainProps {
  transitionKey: string
  children: React.ReactNode
  color?: string
  /** On the positioned wrapper the curtain is scoped to. */
  className?: string
}

export function StepCurtain({
  transitionKey,
  children,
  color = "var(--foreground)",
  className,
}: StepCurtainProps) {
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
      const timeoutMs = DURATION * 1000 + 200

      await withTimeout(
        animate(scope.current, { x: "0%" }, { duration: DURATION, ease: EASE }),
        timeoutMs
      )

      setDisplayedChildren(pendingChildrenRef.current)
      setDisplayedKey(transitionKey)

      await withTimeout(
        animate(
          scope.current,
          { x: "100%" },
          { duration: DURATION, ease: EASE }
        ),
        timeoutMs
      )

      // Back to the left edge instantly, ready for the next step.
      await withTimeout(
        animate(scope.current, { x: "-100%" }, { duration: 0 }),
        200
      )
      runningRef.current = false
    }

    run()
  }, [transitionKey, displayedKey, animate, scope])

  React.useEffect(() => {
    if (transitionKey === displayedKey && !runningRef.current) {
      setDisplayedChildren(children)
    }
  }, [children, transitionKey, displayedKey])

  return (
    <div className={cn("relative min-h-svh", className)}>
      {displayedChildren}
      <motion.div
        ref={scope}
        className="pointer-events-none absolute inset-0 z-50"
        style={{ background: color, x: "-100%" }}
      />
    </div>
  )
}
