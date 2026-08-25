import type { ComponentProps } from "react"
import { SignalMedium as SignalMediumImpl } from "./signal-medium"

export default {
  title: "Icon/Signal Medium",
  component: SignalMediumImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const SignalMedium = (args: ComponentProps<typeof SignalMediumImpl>) => <SignalMediumImpl {...args} />
