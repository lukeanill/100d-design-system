import type { ComponentProps } from "react"
import { MoveRight as MoveRightImpl } from "./move-right"

export default {
  title: "Icon/Move Right",
  component: MoveRightImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const MoveRight = (args: ComponentProps<typeof MoveRightImpl>) => <MoveRightImpl {...args} />
