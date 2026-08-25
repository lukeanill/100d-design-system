import type { ComponentProps } from "react"
import { Clock4 as Clock4Impl } from "./clock-4"

export default {
  title: "Icon/Clock 4",
  component: Clock4Impl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Clock4 = (args: ComponentProps<typeof Clock4Impl>) => <Clock4Impl {...args} />
