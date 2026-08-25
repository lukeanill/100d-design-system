import type { ComponentProps } from "react"
import { ChevronLeftRight as ChevronLeftRightImpl } from "./chevron-left-right"

export default {
  title: "Icon/Chevron Left Right",
  component: ChevronLeftRightImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const ChevronLeftRight = (args: ComponentProps<typeof ChevronLeftRightImpl>) => <ChevronLeftRightImpl {...args} />
