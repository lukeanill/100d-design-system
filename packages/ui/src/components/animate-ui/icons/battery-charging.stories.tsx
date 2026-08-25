import type { ComponentProps } from "react"
import { BatteryCharging as BatteryChargingImpl } from "./battery-charging"

export default {
  title: "Icon/Battery Charging",
  component: BatteryChargingImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const BatteryCharging = (args: ComponentProps<typeof BatteryChargingImpl>) => <BatteryChargingImpl {...args} />
