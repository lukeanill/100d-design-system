import type { ComponentProps } from "react"
import { HouseWifi as HouseWifiImpl } from "./house-wifi"

export default {
  title: "Icon/House Wifi",
  component: HouseWifiImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const HouseWifi = (args: ComponentProps<typeof HouseWifiImpl>) => <HouseWifiImpl {...args} />
