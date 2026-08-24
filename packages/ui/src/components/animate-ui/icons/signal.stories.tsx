import type { ComponentProps } from "react"
import { Signal as SignalImpl } from "./signal"

export default { title: "Icon/Signal", component: SignalImpl }

export const Signal = (args: ComponentProps<typeof SignalImpl>) => <SignalImpl {...args} />
