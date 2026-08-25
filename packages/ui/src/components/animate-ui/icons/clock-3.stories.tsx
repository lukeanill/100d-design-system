import type { ComponentProps } from "react"
import { Clock3 as Clock3Impl } from "./clock-3"

export default {
  title: "Icon/Clock 3",
  component: Clock3Impl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Clock3 = (args: ComponentProps<typeof Clock3Impl>) => <Clock3Impl {...args} />
