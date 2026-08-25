import type { ComponentProps } from "react"
import { ChatConversation as ChatConversationImpl, ChatConversationMessages } from "./chat-conversation"

export default { title: "Components/Chat Conversation", component: ChatConversationImpl }

export const ChatConversation = (args: ComponentProps<typeof ChatConversationImpl>) => (
  <ChatConversationImpl {...args} className="w-96">
    <ChatConversationMessages />
  </ChatConversationImpl>
)
