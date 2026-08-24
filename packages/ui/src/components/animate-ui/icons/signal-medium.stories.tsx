import type { ComponentProps } from "react"
import { SignalMedium as SignalMediumImpl } from "./signal-medium"

export default { title: "Icon/Signal Medium", component: SignalMediumImpl }

export const SignalMedium = (args: ComponentProps<typeof SignalMediumImpl>) => <SignalMediumImpl {...args} />
