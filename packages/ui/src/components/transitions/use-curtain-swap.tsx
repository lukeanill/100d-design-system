"use client"

// The machinery every curtain transition shares: hold the current children,
// run a cover/swap/uncover sequence when the key changes, and keep the swap
// hidden behind whatever the transition draws.
//
// Only the sequence itself differs between transitions, so each one supplies
// that and its own overlay markup.

import * as React from "react"
import { useAnimate, type AnimationScope } from "motion/react"

// Backgrounded or hidden tabs can throttle frames enough that motion's
// animate() promise never resolves, which would strand the sequence and the
// content swap it gates. A timeout floor guarantees it always proceeds.
export function withTimeout(
  controls: { then: (onResolve: () => void) => void },
  ms: number
): Promise<void> {
  return Promise.race([
    new Promise<void>((resolve) => controls.then(resolve)),
    new Promise<void>((resolve) => setTimeout(resolve, ms)),
  ])
}

type Animate = ReturnType<typeof useAnimate>[1]

export interface CurtainSequenceContext<T extends Element> {
  scope: AnimationScope<T>
  animate: Animate
  /** Call while fully covered: swaps the children underneath. */
  swap: () => void
  /** Wraps an animation so a throttled tab can't strand the sequence. */
  settle: (
    controls: { then: (onResolve: () => void) => void },
    ms?: number
  ) => Promise<void>
  duration: number
}

export function useCurtainSwap<T extends Element = HTMLDivElement>({
  transitionKey,
  children,
  duration,
  sequence,
}: {
  transitionKey: string
  children: React.ReactNode
  duration: number
  sequence: (context: CurtainSequenceContext<T>) => Promise<void>
}) {
  const [scope, animate] = useAnimate<T>()
  const [displayedKey, setDisplayedKey] = React.useState(transitionKey)
  const [displayedChildren, setDisplayedChildren] = React.useState(children)
  const pendingChildrenRef = React.useRef(children)
  const runningRef = React.useRef(false)
  // Kept in a ref so a sequence redefined each render doesn't retrigger.
  const sequenceRef = React.useRef(sequence)

  React.useEffect(() => {
    pendingChildrenRef.current = children
    sequenceRef.current = sequence
  })

  React.useEffect(() => {
    if (transitionKey === displayedKey || runningRef.current) return
    runningRef.current = true

    const fallbackMs = duration * 1000 + 200
    const settle = (
      controls: { then: (onResolve: () => void) => void },
      ms = fallbackMs
    ) => withTimeout(controls, ms)

    async function run() {
      await sequenceRef.current({
        scope,
        animate,
        settle,
        duration,
        swap: () => {
          setDisplayedChildren(pendingChildrenRef.current)
          setDisplayedKey(transitionKey)
        },
      })
      runningRef.current = false
    }

    run()
  }, [transitionKey, displayedKey, animate, scope, duration])

  // While idle, keep rendering the latest children: a parent re-render that
  // isn't a transition shouldn't leave a stale page on screen.
  React.useEffect(() => {
    if (transitionKey === displayedKey && !runningRef.current) {
      setDisplayedChildren(children)
    }
  }, [children, transitionKey, displayedKey])

  return { scope, displayedChildren }
}
