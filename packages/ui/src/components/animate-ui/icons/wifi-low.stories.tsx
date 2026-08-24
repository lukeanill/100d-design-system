import type { ComponentProps } from "react"
import { WifiLow as WifiLowImpl } from "./wifi-low"

export default { title: "Icon/Wifi Low", component: WifiLowImpl }

export const WifiLow = (args: ComponentProps<typeof WifiLowImpl>) => <WifiLowImpl {...args} />
