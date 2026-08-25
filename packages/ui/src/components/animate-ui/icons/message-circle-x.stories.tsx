import type { ComponentProps } from "react"
import { MessageCircleX as MessageCircleXImpl } from "./message-circle-x"

export default {
  title: "Icon/Message Circle X",
  component: MessageCircleXImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const MessageCircleX = (args: ComponentProps<typeof MessageCircleXImpl>) => <MessageCircleXImpl {...args} />
