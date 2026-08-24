import type { ComponentProps } from "react"
import { SignalHigh as SignalHighImpl } from "./signal-high"

export default { title: "Icon/Signal High", component: SignalHighImpl }

export const SignalHigh = (args: ComponentProps<typeof SignalHighImpl>) => <SignalHighImpl {...args} />
