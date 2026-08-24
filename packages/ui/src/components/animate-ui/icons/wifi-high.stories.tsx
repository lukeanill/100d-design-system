import type { ComponentProps } from "react"
import { WifiHigh as WifiHighImpl } from "./wifi-high"

export default { title: "Icon/Wifi High", component: WifiHighImpl }

export const WifiHigh = (args: ComponentProps<typeof WifiHighImpl>) => <WifiHighImpl {...args} />
