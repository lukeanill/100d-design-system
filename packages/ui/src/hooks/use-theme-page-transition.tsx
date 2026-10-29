import * as React from "react"

import { EASING, TRANSITION_SPEEDS } from "@workspace/ui/themes/motion"
import { observeTheme } from "@workspace/ui/lib/observe-theme"
import { useThemeMotionChoice } from "@workspace/ui/hooks/use-theme-motion"

/** The curve page transitions use: the ease-in-out token. */
export const PAGE_TRANSITION_EASE = [...EASING["ease-in-out"].normal] as [number, number, number, number]

function readSeconds(): number {
  if (typeof document === "undefined") return TRANSITION_SPEEDS.medium
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--theme-transition-duration").trim()
  const n = parseFloat(raw)
  if (!Number.isFinite(n)) return TRANSITION_SPEEDS.medium
  return raw.endsWith("ms") ? n / 1000 : n
}

/**
 * Seconds for each half of a page transition: the theme's page-transition speed
 * (--theme-transition-duration), or 0 when its Component Animations is None.
 * An explicit `override` wins.
 */
export function useThemeTransitionDuration(override?: number): number {
  const choice = useThemeMotionChoice()
  const [seconds, setSeconds] = React.useState(readSeconds)
  React.useLayoutEffect(() => {
    const update = () => setSeconds(readSeconds())
    update()
    return observeTheme(null, update)
  }, [])
  if (override !== undefined) return override
  return choice === "none" ? 0 : seconds
}
