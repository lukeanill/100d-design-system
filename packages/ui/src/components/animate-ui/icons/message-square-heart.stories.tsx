import type { ComponentProps } from "react"
import { MessageSquareHeart as MessageSquareHeartImpl } from "./message-square-heart"

export default {
  title: "Icon/Message Square Heart",
  component: MessageSquareHeartImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const MessageSquareHeart = (args: ComponentProps<typeof MessageSquareHeartImpl>) => <MessageSquareHeartImpl {...args} />
