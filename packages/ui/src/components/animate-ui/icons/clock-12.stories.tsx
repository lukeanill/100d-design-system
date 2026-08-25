import type { ComponentProps } from "react"
import { Clock12 as Clock12Impl } from "./clock-12"

export default {
  title: "Icon/Clock 12",
  component: Clock12Impl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Clock12 = (args: ComponentProps<typeof Clock12Impl>) => <Clock12Impl {...args} />
