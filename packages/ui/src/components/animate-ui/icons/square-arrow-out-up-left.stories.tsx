import type { ComponentProps } from "react"
import { SquareArrowOutUpLeft as SquareArrowOutUpLeftImpl } from "./square-arrow-out-up-left"

export default {
  title: "Icon/Square Arrow Out Up Left",
  component: SquareArrowOutUpLeftImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const SquareArrowOutUpLeft = (args: ComponentProps<typeof SquareArrowOutUpLeftImpl>) => <SquareArrowOutUpLeftImpl {...args} />
