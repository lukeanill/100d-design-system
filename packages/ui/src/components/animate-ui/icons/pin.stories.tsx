import type { ComponentProps } from "react"
import { Pin as PinImpl } from "./pin"

export default {
  title: "Icon/Pin",
  component: PinImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Pin = (args: ComponentProps<typeof PinImpl>) => <PinImpl {...args} />
