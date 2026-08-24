import type { ComponentProps } from "react"
import { MessageSquareHeart as MessageSquareHeartImpl } from "./message-square-heart"

export default { title: "Icon/Message Square Heart", component: MessageSquareHeartImpl }

export const MessageSquareHeart = (args: ComponentProps<typeof MessageSquareHeartImpl>) => <MessageSquareHeartImpl {...args} />
