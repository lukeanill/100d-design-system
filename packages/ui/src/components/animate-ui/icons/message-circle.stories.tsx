import type { ComponentProps } from "react"
import { MessageCircle as MessageCircleImpl } from "./message-circle"

export default {
  title: "Icon/Message Circle",
  component: MessageCircleImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const MessageCircle = (args: ComponentProps<typeof MessageCircleImpl>) => <MessageCircleImpl {...args} />
