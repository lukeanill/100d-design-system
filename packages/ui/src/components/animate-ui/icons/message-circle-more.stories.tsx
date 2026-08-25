import type { ComponentProps } from "react"
import { MessageCircleMore as MessageCircleMoreImpl } from "./message-circle-more"

export default {
  title: "Icon/Message Circle More",
  component: MessageCircleMoreImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const MessageCircleMore = (args: ComponentProps<typeof MessageCircleMoreImpl>) => <MessageCircleMoreImpl {...args} />
