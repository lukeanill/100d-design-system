import type { ComponentProps } from "react"
import { WifiLow as WifiLowImpl } from "./wifi-low"

export default {
  title: "Icon/Wifi Low",
  component: WifiLowImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const WifiLow = (args: ComponentProps<typeof WifiLowImpl>) => <WifiLowImpl {...args} />
