import type { ComponentProps } from "react"
import { Wifi as WifiImpl } from "./wifi"

export default {
  title: "Icon/Wifi",
  component: WifiImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Wifi = (args: ComponentProps<typeof WifiImpl>) => <WifiImpl {...args} />
