import * as React from "react"
import type { Transition } from "motion/react"

import { MOTION_STYLES, TIMING } from "@workspace/ui/themes/motion"
import { useThemeMotionChoice } from "@workspace/ui/hooks/use-theme-motion"

/** The short transition for small role animations (hover, press, small fades): TIMING.fast on the theme's curve; None is instant. */
export function useFastTransition(): Transition {
  const choice = useThemeMotionChoice()
  return React.useMemo(() => {
    const style = MOTION_STYLES[choice]
    if (style.duration === 0) return { duration: 0 }
    return { duration: TIMING.fast, ease: [...style.curve!] as [number, number, number, number] }
  }, [choice])
}
