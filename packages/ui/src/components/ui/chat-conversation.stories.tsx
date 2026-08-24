import type { ComponentProps } from "react"
import { ChatConversation as ChatConversationImpl } from "./chat-conversation"

export default { title: "Components/Chat Conversation", component: ChatConversationImpl }

export const ChatConversation = (args: ComponentProps<typeof ChatConversationImpl>) => <ChatConversationImpl {...args} />
