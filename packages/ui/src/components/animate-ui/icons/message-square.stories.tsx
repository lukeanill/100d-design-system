import type { ComponentProps } from "react"
import { MessageSquare as MessageSquareImpl } from "./message-square"

export default { title: "Icon/Message Square", component: MessageSquareImpl }

export const MessageSquare = (args: ComponentProps<typeof MessageSquareImpl>) => <MessageSquareImpl {...args} />
