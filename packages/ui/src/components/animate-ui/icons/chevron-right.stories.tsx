import type { ComponentProps } from "react"
import { ChevronRight as ChevronRightImpl } from "./chevron-right"

export default {
  title: "Icon/Chevron Right",
  component: ChevronRightImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const ChevronRight = (args: ComponentProps<typeof ChevronRightImpl>) => <ChevronRightImpl {...args} />
