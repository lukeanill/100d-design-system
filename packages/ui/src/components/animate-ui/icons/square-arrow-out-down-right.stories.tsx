import type { ComponentProps } from "react"
import { SquareArrowOutDownRight as SquareArrowOutDownRightImpl } from "./square-arrow-out-down-right"

export default {
  title: "Icon/Square Arrow Out Down Right",
  component: SquareArrowOutDownRightImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const SquareArrowOutDownRight = (args: ComponentProps<typeof SquareArrowOutDownRightImpl>) => <SquareArrowOutDownRightImpl {...args} />
