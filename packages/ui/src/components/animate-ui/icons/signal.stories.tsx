import type { ComponentProps } from "react"
import { Signal as SignalImpl } from "./signal"

export default {
  title: "Icon/Signal",
  component: SignalImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Signal = (args: ComponentProps<typeof SignalImpl>) => <SignalImpl {...args} />
