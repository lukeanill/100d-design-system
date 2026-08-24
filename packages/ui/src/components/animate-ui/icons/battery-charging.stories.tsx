import type { ComponentProps } from "react"
import { BatteryCharging as BatteryChargingImpl } from "./battery-charging"

export default { title: "Icon/Battery Charging", component: BatteryChargingImpl }

export const BatteryCharging = (args: ComponentProps<typeof BatteryChargingImpl>) => <BatteryChargingImpl {...args} />
