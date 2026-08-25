import type { ComponentProps } from "react"
import { ArrowUp as ArrowUpImpl } from "./arrow-up"

export default {
  title: "Icon/Arrow Up",
  component: ArrowUpImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const ArrowUp = (args: ComponentProps<typeof ArrowUpImpl>) => <ArrowUpImpl {...args} />
