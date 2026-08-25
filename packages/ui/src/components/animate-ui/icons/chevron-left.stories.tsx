import type { ComponentProps } from "react"
import { ChevronLeft as ChevronLeftImpl } from "./chevron-left"

export default {
  title: "Icon/Chevron Left",
  component: ChevronLeftImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const ChevronLeft = (args: ComponentProps<typeof ChevronLeftImpl>) => <ChevronLeftImpl {...args} />
