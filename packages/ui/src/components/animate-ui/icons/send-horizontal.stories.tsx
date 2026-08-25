import type { ComponentProps } from "react"
import { SendHorizontal as SendHorizontalImpl } from "./send-horizontal"

export default {
  title: "Icon/Send Horizontal",
  component: SendHorizontalImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const SendHorizontal = (args: ComponentProps<typeof SendHorizontalImpl>) => <SendHorizontalImpl {...args} />
