import type { ComponentProps } from "react"
import { SignalLow as SignalLowImpl } from "./signal-low"

export default { title: "Icon/Signal Low", component: SignalLowImpl }

export const SignalLow = (args: ComponentProps<typeof SignalLowImpl>) => <SignalLowImpl {...args} />
