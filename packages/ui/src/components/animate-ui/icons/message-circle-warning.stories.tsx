import type { ComponentProps } from "react"
import { MessageCircleWarning as MessageCircleWarningImpl } from "./message-circle-warning"

export default { title: "Icon/Message Circle Warning", component: MessageCircleWarningImpl }

export const MessageCircleWarning = (args: ComponentProps<typeof MessageCircleWarningImpl>) => <MessageCircleWarningImpl {...args} />
