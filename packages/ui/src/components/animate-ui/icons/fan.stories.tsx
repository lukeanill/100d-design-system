import type { ComponentProps } from "react"
import { Fan as FanImpl } from "./fan"

export default {
  title: "Icon/Fan",
  component: FanImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Fan = (args: ComponentProps<typeof FanImpl>) => <FanImpl {...args} />
