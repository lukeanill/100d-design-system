import type { ComponentProps } from "react"
import { Clock as ClockImpl } from "./clock"

export default {
  title: "Icon/Clock",
  component: ClockImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Clock = (args: ComponentProps<typeof ClockImpl>) => <ClockImpl {...args} />
