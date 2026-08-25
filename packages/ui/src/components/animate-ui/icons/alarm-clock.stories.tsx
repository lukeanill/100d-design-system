import type { ComponentProps } from "react"
import { AlarmClock as AlarmClockImpl } from "./alarm-clock"

export default {
  title: "Icon/Alarm Clock",
  component: AlarmClockImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const AlarmClock = (args: ComponentProps<typeof AlarmClockImpl>) => <AlarmClockImpl {...args} />
