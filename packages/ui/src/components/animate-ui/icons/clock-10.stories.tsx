import type { ComponentProps } from "react"
import { Clock10 as Clock10Impl } from "./clock-10"

export default {
  title: "Icon/Clock 10",
  component: Clock10Impl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Clock10 = (args: ComponentProps<typeof Clock10Impl>) => <Clock10Impl {...args} />
