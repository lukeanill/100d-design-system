import type { ComponentProps } from "react"
import { Clock as ClockImpl } from "./clock"

export default { title: "Icon/Clock", component: ClockImpl }

export const Clock = (args: ComponentProps<typeof ClockImpl>) => <ClockImpl {...args} />
