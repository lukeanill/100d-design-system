import { useEffect, useState, type RefObject } from "react"
import { useInView } from "motion/react"

/**
 * True once the element has been in view for `delay` ms. It is seen once and stays true, so a figure or a
 * stream that waits for this starts after a pause the reader can notice, and does not start again.
 */
function useDelayedInView(ref: RefObject<Element | null>, delay: number) {
  const seen = useInView(ref, { once: true })
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!seen) return
    const id = window.setTimeout(() => setReady(true), delay)
    return () => window.clearTimeout(id)
  }, [seen, delay])

  return ready
}

export { useDelayedInView }
