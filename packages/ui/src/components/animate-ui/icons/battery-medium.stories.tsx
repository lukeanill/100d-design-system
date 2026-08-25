import type { ComponentProps } from "react"
import { BatteryMedium as BatteryMediumImpl } from "./battery-medium"

export default {
  title: "Icon/Battery Medium",
  component: BatteryMediumImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const BatteryMedium = (args: ComponentProps<typeof BatteryMediumImpl>) => <BatteryMediumImpl {...args} />
