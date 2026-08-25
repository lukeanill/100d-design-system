import type { ComponentProps } from "react"
import { SquareArrowOutUpRight as SquareArrowOutUpRightImpl } from "./square-arrow-out-up-right"

export default {
  title: "Icon/Square Arrow Out Up Right",
  component: SquareArrowOutUpRightImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const SquareArrowOutUpRight = (args: ComponentProps<typeof SquareArrowOutUpRightImpl>) => <SquareArrowOutUpRightImpl {...args} />
