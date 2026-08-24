import type { ComponentProps } from "react"
import { MessageSquarePlus as MessageSquarePlusImpl } from "./message-square-plus"

export default { title: "Icon/Message Square Plus", component: MessageSquarePlusImpl }

export const MessageSquarePlus = (args: ComponentProps<typeof MessageSquarePlusImpl>) => <MessageSquarePlusImpl {...args} />
