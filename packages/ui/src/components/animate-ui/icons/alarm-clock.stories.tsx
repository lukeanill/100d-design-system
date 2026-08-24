import type { ComponentProps } from "react"
import { AlarmClock as AlarmClockImpl } from "./alarm-clock"

export default { title: "Icon/Alarm Clock", component: AlarmClockImpl }

export const AlarmClock = (args: ComponentProps<typeof AlarmClockImpl>) => <AlarmClockImpl {...args} />
