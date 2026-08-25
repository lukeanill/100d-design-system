import type { ComponentProps } from "react"
import { TimerOff as TimerOffImpl } from "./timer-off"

export default {
  title: "Icon/Timer Off",
  component: TimerOffImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const TimerOff = (args: ComponentProps<typeof TimerOffImpl>) => <TimerOffImpl {...args} />
