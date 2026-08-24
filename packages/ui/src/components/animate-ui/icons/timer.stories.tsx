import type { ComponentProps } from "react"
import { Timer as TimerImpl } from "./timer"

export default { title: "Icon/Timer", component: TimerImpl }

export const Timer = (args: ComponentProps<typeof TimerImpl>) => <TimerImpl {...args} />
