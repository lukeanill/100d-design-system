import type { ComponentProps } from "react"
import { TimerOff as TimerOffImpl } from "./timer-off"

export default { title: "Icon/Timer Off", component: TimerOffImpl }

export const TimerOff = (args: ComponentProps<typeof TimerOffImpl>) => <TimerOffImpl {...args} />
