import type { ComponentProps } from "react"
import { MessageCircleOff as MessageCircleOffImpl } from "./message-circle-off"

export default { title: "Icon/Message Circle Off", component: MessageCircleOffImpl }

export const MessageCircleOff = (args: ComponentProps<typeof MessageCircleOffImpl>) => <MessageCircleOffImpl {...args} />
