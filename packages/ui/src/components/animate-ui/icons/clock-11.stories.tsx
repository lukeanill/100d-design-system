import type { ComponentProps } from "react"
import { Clock11 as Clock11Impl } from "./clock-11"

export default {
  title: "Icon/Clock 11",
  component: Clock11Impl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Clock11 = (args: ComponentProps<typeof Clock11Impl>) => <Clock11Impl {...args} />
