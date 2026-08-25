import type { ComponentProps } from "react"
import { MessageCircleOff as MessageCircleOffImpl } from "./message-circle-off"

export default {
  title: "Icon/Message Circle Off",
  component: MessageCircleOffImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const MessageCircleOff = (args: ComponentProps<typeof MessageCircleOffImpl>) => <MessageCircleOffImpl {...args} />
