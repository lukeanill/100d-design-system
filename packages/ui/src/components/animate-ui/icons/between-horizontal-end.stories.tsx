import type { ComponentProps } from "react"
import { BetweenHorizontalEnd as BetweenHorizontalEndImpl } from "./between-horizontal-end"

export default {
  title: "Icon/Between Horizontal End",
  component: BetweenHorizontalEndImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const BetweenHorizontalEnd = (args: ComponentProps<typeof BetweenHorizontalEndImpl>) => <BetweenHorizontalEndImpl {...args} />
