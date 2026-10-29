import * as React from "react"
import { MotionConfig, motion } from "motion/react"

import { MOTION_STYLES, motionTransition } from "@workspace/ui/themes/motion"

export default { title: "Animation/Theme Motion", tags: ["!dev"] }

const choices = Object.keys(MOTION_STYLES) as (keyof typeof MOTION_STYLES)[]

/** Each Component Animations choice moving the same box; none of them sets its own timing. */
export const ComponentAnimations = () => {
  const [on, setOn] = React.useState(false)
  return (
    <div className="flex flex-col gap-4 p-6">
      <button className="self-start rounded-md border px-3 py-1.5 text-sm" onClick={() => setOn((v) => !v)}>
        Move
      </button>
      {choices.map((choice) => (
        <MotionConfig key={choice} transition={motionTransition(choice)}>
          <div className="flex items-center gap-3">
            <span className="w-20 text-sm">{MOTION_STYLES[choice].label}</span>
            <div className="relative h-8 w-80 rounded-md bg-muted">
              <motion.div className="absolute top-1 size-6 rounded-full bg-foreground" animate={{ x: on ? 280 : 4 }} />
            </div>
          </div>
        </MotionConfig>
      ))}
    </div>
  )
}
