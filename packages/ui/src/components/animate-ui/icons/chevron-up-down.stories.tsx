import type { ComponentProps } from "react"
import { ChevronUpDown as ChevronUpDownImpl } from "./chevron-up-down"

export default {
  title: "Icon/Chevron Up Down",
  component: ChevronUpDownImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const ChevronUpDown = (args: ComponentProps<typeof ChevronUpDownImpl>) => <ChevronUpDownImpl {...args} />
