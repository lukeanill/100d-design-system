import type { ComponentProps } from "react"
import { MessageSquareMore as MessageSquareMoreImpl } from "./message-square-more"

export default { title: "Icon/Message Square More", component: MessageSquareMoreImpl }

export const MessageSquareMore = (args: ComponentProps<typeof MessageSquareMoreImpl>) => <MessageSquareMoreImpl {...args} />
