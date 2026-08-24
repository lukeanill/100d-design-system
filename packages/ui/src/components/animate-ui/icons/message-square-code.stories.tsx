import type { ComponentProps } from "react"
import { MessageSquareCode as MessageSquareCodeImpl } from "./message-square-code"

export default { title: "Icon/Message Square Code", component: MessageSquareCodeImpl }

export const MessageSquareCode = (args: ComponentProps<typeof MessageSquareCodeImpl>) => <MessageSquareCodeImpl {...args} />
