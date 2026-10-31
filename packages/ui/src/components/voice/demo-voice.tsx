"use client"

import { useCallback, useEffect, useRef } from "react"

/**
 * A made-up voice level, 0–1, for demos and stories where no microphone is wanted: syllables that swell and
 * fall, gaps between phrases. Returns a getter to hand to a `level` prop, which samples it every frame
 * without re-rendering. `speaking` false holds it at silence.
 */
function useDemoVoice(speaking = true) {
  const start = useRef(0)
  const on = useRef(speaking)
  useEffect(() => {
    on.current = speaking
    if (speaking) start.current = performance.now()
  }, [speaking])

  return useCallback(() => {
    if (!on.current) return 0
    const t = (performance.now() - start.current) / 1000
    // a phrase of about 2.4 s with a short breath, syllables at about 4 per second
    const phrase = Math.max(0, Math.sin(((t % 2.8) / 2.4) * Math.PI))
    const syllables = 0.55 + 0.45 * Math.sin(t * 25) * Math.sin(t * 9.7 + 1.3)
    return Math.min(1, phrase * syllables * 1.05)
  }, [])
}

export { useDemoVoice }
