import type { ComponentProps } from "react"
import { BellRing as BellRingImpl } from "./bell-ring"

export default {
  title: "Icon/Bell Ring",
  component: BellRingImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const BellRing = (args: ComponentProps<typeof BellRingImpl>) => <BellRingImpl {...args} />
