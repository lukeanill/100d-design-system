import type { ComponentProps } from "react"
import { MessageSquareShare as MessageSquareShareImpl } from "./message-square-share"

export default { title: "Icon/Message Square Share", component: MessageSquareShareImpl }

export const MessageSquareShare = (args: ComponentProps<typeof MessageSquareShareImpl>) => <MessageSquareShareImpl {...args} />
