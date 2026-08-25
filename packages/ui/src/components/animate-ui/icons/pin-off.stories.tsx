import type { ComponentProps } from "react"
import { PinOff as PinOffImpl } from "./pin-off"

export default {
  title: "Icon/Pin Off",
  component: PinOffImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const PinOff = (args: ComponentProps<typeof PinOffImpl>) => <PinOffImpl {...args} />
