import type { ComponentProps } from "react"
import { MessageCircleMore as MessageCircleMoreImpl } from "./message-circle-more"

export default { title: "Icon/Message Circle More", component: MessageCircleMoreImpl }

export const MessageCircleMore = (args: ComponentProps<typeof MessageCircleMoreImpl>) => <MessageCircleMoreImpl {...args} />
