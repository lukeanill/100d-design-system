import type { ComponentProps } from "react"
import { BatteryLow as BatteryLowImpl } from "./battery-low"

export default {
  title: "Icon/Battery Low",
  component: BatteryLowImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const BatteryLow = (args: ComponentProps<typeof BatteryLowImpl>) => <BatteryLowImpl {...args} />
