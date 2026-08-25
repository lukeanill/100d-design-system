import type { ComponentProps } from "react"
import { Timer as TimerImpl } from "./timer"

export default {
  title: "Icon/Timer",
  component: TimerImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Timer = (args: ComponentProps<typeof TimerImpl>) => <TimerImpl {...args} />
