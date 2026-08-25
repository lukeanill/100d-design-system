import type { ComponentProps } from "react"
import { BetweenVerticalEnd as BetweenVerticalEndImpl } from "./between-vertical-end"

export default {
  title: "Icon/Between Vertical End",
  component: BetweenVerticalEndImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const BetweenVerticalEnd = (args: ComponentProps<typeof BetweenVerticalEndImpl>) => <BetweenVerticalEndImpl {...args} />
