import type { ComponentProps } from "react"
import { MessageSquareDot as MessageSquareDotImpl } from "./message-square-dot"

export default { title: "Icon/Message Square Dot", component: MessageSquareDotImpl }

export const MessageSquareDot = (args: ComponentProps<typeof MessageSquareDotImpl>) => <MessageSquareDotImpl {...args} />
