import type { ComponentProps } from "react"
import { MessageSquareX as MessageSquareXImpl } from "./message-square-x"

export default { title: "Icon/Message Square X", component: MessageSquareXImpl }

export const MessageSquareX = (args: ComponentProps<typeof MessageSquareXImpl>) => <MessageSquareXImpl {...args} />
