import type { ComponentProps } from "react"
import { Clock7 as Clock7Impl } from "./clock-7"

export default {
  title: "Icon/Clock 7",
  component: Clock7Impl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Clock7 = (args: ComponentProps<typeof Clock7Impl>) => <Clock7Impl {...args} />
