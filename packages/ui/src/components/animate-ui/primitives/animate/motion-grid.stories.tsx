import type { ComponentProps } from "react"
import { MotionGrid as MotionGridImpl } from "./motion-grid"

export default { title: "Animation/Motion Grid Animate", component: MotionGridImpl, args: { gridSize: [3, 3], frames: [[[0, 0], [1, 1], [2, 2]]] } }

export const MotionGridAnimate = (args: ComponentProps<typeof MotionGridImpl>) => <MotionGridImpl {...args} />
