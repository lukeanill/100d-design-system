import type { ComponentProps } from "react"
import { MessageCircleHeart as MessageCircleHeartImpl } from "./message-circle-heart"

export default {
  title: "Icon/Message Circle Heart",
  component: MessageCircleHeartImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const MessageCircleHeart = (args: ComponentProps<typeof MessageCircleHeartImpl>) => <MessageCircleHeartImpl {...args} />
