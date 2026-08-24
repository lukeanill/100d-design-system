import type { ComponentProps } from "react"
import { SignalZero as SignalZeroImpl } from "./signal-zero"

export default { title: "Icon/Signal Zero", component: SignalZeroImpl }

export const SignalZero = (args: ComponentProps<typeof SignalZeroImpl>) => <SignalZeroImpl {...args} />
