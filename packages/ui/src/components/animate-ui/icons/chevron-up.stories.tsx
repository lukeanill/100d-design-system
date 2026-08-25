import type { ComponentProps } from "react"
import { ChevronUp as ChevronUpImpl } from "./chevron-up"

export default {
  title: "Icon/Chevron Up",
  component: ChevronUpImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const ChevronUp = (args: ComponentProps<typeof ChevronUpImpl>) => <ChevronUpImpl {...args} />
