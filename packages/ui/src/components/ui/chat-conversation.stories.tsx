import type { ComponentProps } from "react"
import { ChatConversation as ChatConversationImpl, ChatConversationMessages } from "./chat-conversation"

export default {
  title: "Components/Content/Chat Conversation",
  component: ChatConversationImpl,
  argTypes: {
    "data.messages": { table: { disable: true } },
  },
  args: {
    data: {
      messages: [
        {
          author: "Sarah",
          avatarFallback: "S",
          content: "Hey! Check out this new feature we just shipped",
          time: "10:30 AM",
          type: "text",
        },
        {
          author: "You",
          avatarFallback: "Y",
          content: "Oh wow, that looks amazing! How long did it take to build?",
          isOwn: true,
          status: "read",
          time: "10:31 AM",
          type: "text",
        },
        {
          author: "Sarah",
          avatarFallback: "S",
          content: "Here's a preview of the dashboard",
          image: "https://picsum.photos/seed/chat-attachment/400/300",
          time: "10:32 AM",
          type: "image",
        },
        {
          author: "You",
          avatarFallback: "Y",
          content: "This is incredible! The UI is so clean",
          isOwn: true,
          status: "delivered",
          time: "10:33 AM",
          type: "text",
        },
      ],
    },
  },
}

export const ChatConversation = (args: ComponentProps<typeof ChatConversationImpl>) => (
  <ChatConversationImpl {...args} className="w-96">
    <ChatConversationMessages />
  </ChatConversationImpl>
)
