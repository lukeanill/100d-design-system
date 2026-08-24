import type { ComponentProps } from "react"
import { BatteryLow as BatteryLowImpl } from "./battery-low"

export default { title: "Icon/Battery Low", component: BatteryLowImpl }

export const BatteryLow = (args: ComponentProps<typeof BatteryLowImpl>) => <BatteryLowImpl {...args} />
