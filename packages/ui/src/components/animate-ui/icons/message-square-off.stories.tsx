import type { ComponentProps } from "react"
import { MessageSquareOff as MessageSquareOffImpl } from "./message-square-off"

export default { title: "Icon/Message Square Off", component: MessageSquareOffImpl }

export const MessageSquareOff = (args: ComponentProps<typeof MessageSquareOffImpl>) => <MessageSquareOffImpl {...args} />
