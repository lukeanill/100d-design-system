import type { ComponentProps } from "react"
import { RefreshCwOff as RefreshCwOffImpl } from "./refresh-cw-off"

export default {
  title: "Icon/Refresh Cw Off",
  component: RefreshCwOffImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const RefreshCwOff = (args: ComponentProps<typeof RefreshCwOffImpl>) => <RefreshCwOffImpl {...args} />
