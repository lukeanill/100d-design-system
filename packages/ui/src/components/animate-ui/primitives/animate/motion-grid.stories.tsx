import type { ComponentProps } from "react"
import { MotionGrid as MotionGridImpl, MotionGridCells } from "./motion-grid"

export default {
  title: "Animation/Motion Grid Animate",
  tags: ["!dev"],
  component: MotionGridImpl,
  argTypes: {
    duration: { control: { type: "range", min: 50, max: 1000, step: 50 } },
  },
  args: {
    gridSize: [3, 3],
    frames: [
      [
        [0, 0],
        [1, 1],
        [2, 2],
      ],
      [
        [0, 2],
        [1, 1],
        [2, 0],
      ],
    ],
    duration: 400,
    animate: true,
  },
}

export const MotionGridAnimate = (args: ComponentProps<typeof MotionGridImpl>) => (
  <MotionGridImpl {...args} style={{ width: 120, height: 120, gap: 4 }}>
    <MotionGridCells
      style={{ borderRadius: 4, backgroundColor: "#e5e5e5" }}
      activeProps={{ style: { backgroundColor: "#6366f1" } }}
    />
  </MotionGridImpl>
)
