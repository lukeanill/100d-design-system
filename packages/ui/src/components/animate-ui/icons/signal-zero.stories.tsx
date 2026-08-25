import type { ComponentProps } from "react"
import { SignalZero as SignalZeroImpl } from "./signal-zero"

export default {
  title: "Icon/Signal Zero",
  component: SignalZeroImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const SignalZero = (args: ComponentProps<typeof SignalZeroImpl>) => <SignalZeroImpl {...args} />
