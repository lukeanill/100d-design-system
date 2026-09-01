import type { ComponentProps } from "react"
import { MessageBubble as MessageBubbleImpl, MessageBubbleContent } from "./message-bubble"

export default {
  title: "Components/Content/Message Bubble",
  component: MessageBubbleImpl,
  argTypes: {
    "data.content": { control: "text" },
    "data.author": { control: "text" },
    "data.time": { control: "text" },
    "data.avatarFallback": { control: "text" },
    "data.avatarUrl": { control: "text" },
    "appearance.isOwn": { control: "boolean" },
    "control.status": {
      control: "select",
      options: ["sent", "delivered", "read"],
    },
  },
  args: {
    appearance: { isOwn: true },
    control: { status: "read" },
    data: {
      author: "You",
      avatarFallback: "Y",
      content: "Sounds good, see you at 3pm!",
      time: "10:31 AM",
    },
  },
}

export const MessageBubble = (args: ComponentProps<typeof MessageBubbleImpl>) => (
  <MessageBubbleImpl {...args}>
    <MessageBubbleContent />
  </MessageBubbleImpl>
)
