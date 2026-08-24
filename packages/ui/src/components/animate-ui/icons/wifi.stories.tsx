import type { ComponentProps } from "react"
import { Wifi as WifiImpl } from "./wifi"

export default { title: "Icon/Wifi", component: WifiImpl }

export const Wifi = (args: ComponentProps<typeof WifiImpl>) => <WifiImpl {...args} />
