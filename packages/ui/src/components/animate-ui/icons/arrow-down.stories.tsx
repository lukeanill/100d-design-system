import type { ComponentProps } from "react"
import { ArrowDown as ArrowDownImpl } from "./arrow-down"

export default {
  title: "Icon/Arrow Down",
  component: ArrowDownImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const ArrowDown = (args: ComponentProps<typeof ArrowDownImpl>) => <ArrowDownImpl {...args} />
