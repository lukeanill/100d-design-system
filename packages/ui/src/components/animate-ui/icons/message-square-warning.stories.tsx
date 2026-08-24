import type { ComponentProps } from "react"
import { MessageSquareWarning as MessageSquareWarningImpl } from "./message-square-warning"

export default { title: "Icon/Message Square Warning", component: MessageSquareWarningImpl }

export const MessageSquareWarning = (args: ComponentProps<typeof MessageSquareWarningImpl>) => <MessageSquareWarningImpl {...args} />
