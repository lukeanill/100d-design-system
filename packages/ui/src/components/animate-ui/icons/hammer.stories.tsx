import type { ComponentProps } from "react"
import { Hammer as HammerImpl } from "./hammer"

export default {
  title: "Icon/Hammer",
  component: HammerImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Hammer = (args: ComponentProps<typeof HammerImpl>) => <HammerImpl {...args} />
