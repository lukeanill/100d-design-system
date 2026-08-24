import type { ComponentProps } from "react"
import { MessageCirclePlus as MessageCirclePlusImpl } from "./message-circle-plus"

export default { title: "Icon/Message Circle Plus", component: MessageCirclePlusImpl }

export const MessageCirclePlus = (args: ComponentProps<typeof MessageCirclePlusImpl>) => <MessageCirclePlusImpl {...args} />
