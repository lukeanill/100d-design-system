import type { ComponentProps } from "react"
import { BetweenHorizontalStart as BetweenHorizontalStartImpl } from "./between-horizontal-start"

export default {
  title: "Icon/Between Horizontal Start",
  component: BetweenHorizontalStartImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const BetweenHorizontalStart = (args: ComponentProps<typeof BetweenHorizontalStartImpl>) => <BetweenHorizontalStartImpl {...args} />
