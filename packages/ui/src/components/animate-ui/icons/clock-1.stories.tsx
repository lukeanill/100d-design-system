import type { ComponentProps } from "react"
import { Clock1 as Clock1Impl } from "./clock-1"

export default {
  title: "Icon/Clock 1",
  component: Clock1Impl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Clock1 = (args: ComponentProps<typeof Clock1Impl>) => <Clock1Impl {...args} />
