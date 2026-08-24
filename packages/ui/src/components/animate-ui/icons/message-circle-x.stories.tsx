import type { ComponentProps } from "react"
import { MessageCircleX as MessageCircleXImpl } from "./message-circle-x"

export default { title: "Icon/Message Circle X", component: MessageCircleXImpl }

export const MessageCircleX = (args: ComponentProps<typeof MessageCircleXImpl>) => <MessageCircleXImpl {...args} />
