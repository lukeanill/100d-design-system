import type { ComponentProps } from "react"
import { MessageCircleHeart as MessageCircleHeartImpl } from "./message-circle-heart"

export default { title: "Icon/Message Circle Heart", component: MessageCircleHeartImpl }

export const MessageCircleHeart = (args: ComponentProps<typeof MessageCircleHeartImpl>) => <MessageCircleHeartImpl {...args} />
