import * as React from "react"
import type { SpringOptions, Transition } from "motion/react"

import { MOTION_STYLES, motionTransition } from "@workspace/ui/themes/motion"

export { motionTransition }
import { observeTheme } from "@workspace/ui/lib/observe-theme"

export type MotionChoice = keyof typeof MOTION_STYLES

/** The Component Animations choice in effect on `el` (the page by default), read from --theme-motion. */
function readChoice(el?: Element | null): MotionChoice {
  if (typeof document === "undefined") return "ease"
  const value = getComputedStyle(el ?? document.documentElement).getPropertyValue("--theme-motion").trim()
  return value in MOTION_STYLES ? (value as MotionChoice) : "ease"
}

/** The active theme's Component Animations choice, kept current as the theme changes. */
export function useThemeMotionChoice(el?: Element | null): MotionChoice {
  const [choice, setChoice] = React.useState<MotionChoice>(() => readChoice(el))
  React.useLayoutEffect(() => {
    const update = () => setChoice(readChoice(el))
    update()
    return observeTheme(el ?? null, update)
  }, [el])
  return choice
}

/** The transition components use unless they are given their own: the active theme's choice. */
export function useThemeTransition(el?: Element | null): Transition {
  const choice = useThemeMotionChoice(el)
  return React.useMemo(() => motionTransition(choice), [choice])
}

/** The theme's choice as spring options, for `useSpring`, which does not read the default transition. */
export function useThemeSpring(): SpringOptions {
  const t = useThemeTransition() as { duration?: number; bounce?: number }
  // a spring has no curve: Ease and Emphatic settle over their duration without bounce, None snaps
  return t.duration === 0 ? { duration: 0.001, bounce: 0 } : { duration: t.duration, bounce: t.bounce ?? 0 }
}
