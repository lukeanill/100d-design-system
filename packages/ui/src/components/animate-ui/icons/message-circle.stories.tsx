import type { ComponentProps } from "react"
import { MessageCircle as MessageCircleImpl } from "./message-circle"

export default { title: "Icon/Message Circle", component: MessageCircleImpl }

export const MessageCircle = (args: ComponentProps<typeof MessageCircleImpl>) => <MessageCircleImpl {...args} />
