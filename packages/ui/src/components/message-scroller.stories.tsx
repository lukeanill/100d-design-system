import type { ComponentProps } from "react"
import { MessageScroller as MessageScrollerImpl } from "./message-scroller"

export default { title: "Components/Message Scroller", component: MessageScrollerImpl }

export const MessageScroller = (args: ComponentProps<typeof MessageScrollerImpl>) => <MessageScrollerImpl {...args} />
