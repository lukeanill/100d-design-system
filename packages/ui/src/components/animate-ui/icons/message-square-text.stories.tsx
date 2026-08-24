import type { ComponentProps } from "react"
import { MessageSquareText as MessageSquareTextImpl } from "./message-square-text"

export default { title: "Icon/Message Square Text", component: MessageSquareTextImpl }

export const MessageSquareText = (args: ComponentProps<typeof MessageSquareTextImpl>) => <MessageSquareTextImpl {...args} />
