import type { ComponentProps } from "react"
import { MessageCircleCode as MessageCircleCodeImpl } from "./message-circle-code"

export default { title: "Icon/Message Circle Code", component: MessageCircleCodeImpl }

export const MessageCircleCode = (args: ComponentProps<typeof MessageCircleCodeImpl>) => <MessageCircleCodeImpl {...args} />
