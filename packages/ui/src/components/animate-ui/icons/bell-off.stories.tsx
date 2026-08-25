import type { ComponentProps } from "react"
import { BellOff as BellOffImpl } from "./bell-off"

export default {
  title: "Icon/Bell Off",
  component: BellOffImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const BellOff = (args: ComponentProps<typeof BellOffImpl>) => <BellOffImpl {...args} />
