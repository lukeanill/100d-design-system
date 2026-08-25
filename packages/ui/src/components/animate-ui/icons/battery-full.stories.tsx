import type { ComponentProps } from "react"
import { BatteryFull as BatteryFullImpl } from "./battery-full"

export default {
  title: "Icon/Battery Full",
  component: BatteryFullImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const BatteryFull = (args: ComponentProps<typeof BatteryFullImpl>) => <BatteryFullImpl {...args} />
