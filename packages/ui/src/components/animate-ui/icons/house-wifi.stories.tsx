import type { ComponentProps } from "react"
import { HouseWifi as HouseWifiImpl } from "./house-wifi"

export default { title: "Icon/House Wifi", component: HouseWifiImpl }

export const HouseWifi = (args: ComponentProps<typeof HouseWifiImpl>) => <HouseWifiImpl {...args} />
