import type { ComponentProps } from "react"
import { SignalHigh as SignalHighImpl } from "./signal-high"

export default {
  title: "Icon/Signal High",
  component: SignalHighImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const SignalHigh = (args: ComponentProps<typeof SignalHighImpl>) => <SignalHighImpl {...args} />
