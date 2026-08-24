import type { ComponentProps } from "react"
import { BatteryFull as BatteryFullImpl } from "./battery-full"

export default { title: "Icon/Battery Full", component: BatteryFullImpl }

export const BatteryFull = (args: ComponentProps<typeof BatteryFullImpl>) => <BatteryFullImpl {...args} />
