import type { ComponentProps } from "react"
import { SquareArrowOutDownLeft as SquareArrowOutDownLeftImpl } from "./square-arrow-out-down-left"

export default {
  title: "Icon/Square Arrow Out Down Left",
  component: SquareArrowOutDownLeftImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const SquareArrowOutDownLeft = (args: ComponentProps<typeof SquareArrowOutDownLeftImpl>) => <SquareArrowOutDownLeftImpl {...args} />
