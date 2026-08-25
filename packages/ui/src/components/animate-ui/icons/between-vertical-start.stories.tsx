import type { ComponentProps } from "react"
import { BetweenVerticalStart as BetweenVerticalStartImpl } from "./between-vertical-start"

export default {
  title: "Icon/Between Vertical Start",
  component: BetweenVerticalStartImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const BetweenVerticalStart = (args: ComponentProps<typeof BetweenVerticalStartImpl>) => <BetweenVerticalStartImpl {...args} />
