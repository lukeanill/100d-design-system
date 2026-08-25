import type { ComponentProps } from "react"
import { WifiHigh as WifiHighImpl } from "./wifi-high"

export default {
  title: "Icon/Wifi High",
  component: WifiHighImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const WifiHigh = (args: ComponentProps<typeof WifiHighImpl>) => <WifiHighImpl {...args} />
