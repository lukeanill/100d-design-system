import type { ComponentProps } from "react"
import { Clock9 as Clock9Impl } from "./clock-9"

export default {
  title: "Icon/Clock 9",
  component: Clock9Impl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Clock9 = (args: ComponentProps<typeof Clock9Impl>) => <Clock9Impl {...args} />
