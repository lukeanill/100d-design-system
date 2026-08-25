import type { ComponentProps } from "react"
import { WifiZero as WifiZeroImpl } from "./wifi-zero"

export default {
  title: "Icon/Wifi Zero",
  component: WifiZeroImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const WifiZero = (args: ComponentProps<typeof WifiZeroImpl>) => <WifiZeroImpl {...args} />
