import type { ComponentProps } from "react"
import { MessageSquareText as MessageSquareTextImpl } from "./message-square-text"

export default {
  title: "Icon/Message Square Text",
  component: MessageSquareTextImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const MessageSquareText = (args: ComponentProps<typeof MessageSquareTextImpl>) => <MessageSquareTextImpl {...args} />
