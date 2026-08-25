import type { ComponentProps } from "react"
import { Clock2 as Clock2Impl } from "./clock-2"

export default {
  title: "Icon/Clock 2",
  component: Clock2Impl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Clock2 = (args: ComponentProps<typeof Clock2Impl>) => <Clock2Impl {...args} />
