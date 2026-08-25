import type { ComponentProps } from "react"
import { SignalLow as SignalLowImpl } from "./signal-low"

export default {
  title: "Icon/Signal Low",
  component: SignalLowImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const SignalLow = (args: ComponentProps<typeof SignalLowImpl>) => <SignalLowImpl {...args} />
