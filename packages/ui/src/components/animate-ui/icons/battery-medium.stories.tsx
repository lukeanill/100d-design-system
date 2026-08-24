import type { ComponentProps } from "react"
import { BatteryMedium as BatteryMediumImpl } from "./battery-medium"

export default { title: "Icon/Battery Medium", component: BatteryMediumImpl }

export const BatteryMedium = (args: ComponentProps<typeof BatteryMediumImpl>) => <BatteryMediumImpl {...args} />
