import type { ComponentProps } from "react"
import { ChevronDown as ChevronDownImpl } from "./chevron-down"

export default {
  title: "Icon/Chevron Down",
  component: ChevronDownImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const ChevronDown = (args: ComponentProps<typeof ChevronDownImpl>) => <ChevronDownImpl {...args} />
