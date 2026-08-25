import type { ComponentProps } from "react"
import { MessageSquareShare as MessageSquareShareImpl } from "./message-square-share"

export default {
  title: "Icon/Message Square Share",
  component: MessageSquareShareImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const MessageSquareShare = (args: ComponentProps<typeof MessageSquareShareImpl>) => <MessageSquareShareImpl {...args} />
