import type { ComponentProps } from "react"
import { WifiZero as WifiZeroImpl } from "./wifi-zero"

export default { title: "Icon/Wifi Zero", component: WifiZeroImpl }

export const WifiZero = (args: ComponentProps<typeof WifiZeroImpl>) => <WifiZeroImpl {...args} />
