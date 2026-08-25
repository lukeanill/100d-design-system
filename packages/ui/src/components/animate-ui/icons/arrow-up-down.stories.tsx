import type { ComponentProps } from "react"
import { ArrowUpDown as ArrowUpDownImpl } from "./arrow-up-down"

export default {
  title: "Icon/Arrow Up Down",
  component: ArrowUpDownImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const ArrowUpDown = (args: ComponentProps<typeof ArrowUpDownImpl>) => <ArrowUpDownImpl {...args} />
