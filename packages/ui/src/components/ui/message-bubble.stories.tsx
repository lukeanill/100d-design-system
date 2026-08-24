import type { ComponentProps } from "react"
import { MessageBubble as MessageBubbleImpl } from "./message-bubble"

export default { title: "Components/Message Bubble", component: MessageBubbleImpl }

export const MessageBubble = (args: ComponentProps<typeof MessageBubbleImpl>) => <MessageBubbleImpl {...args} />
