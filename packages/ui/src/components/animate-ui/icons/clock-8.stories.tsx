import type { ComponentProps } from "react"
import { Clock8 as Clock8Impl } from "./clock-8"

export default {
  title: "Icon/Clock 8",
  component: Clock8Impl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Clock8 = (args: ComponentProps<typeof Clock8Impl>) => <Clock8Impl {...args} />
