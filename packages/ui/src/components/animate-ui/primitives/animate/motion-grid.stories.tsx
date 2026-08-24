import type { ComponentProps } from "react"
import { MotionGrid as MotionGridImpl } from "./motion-grid"

export default { title: "Animation/Motion Grid Animate", component: MotionGridImpl }

export const MotionGridAnimate = (args: ComponentProps<typeof MotionGridImpl>) => <MotionGridImpl {...args} />
