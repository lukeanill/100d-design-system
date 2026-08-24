import type { ComponentProps } from "react"
import { MessageCircleDashed as MessageCircleDashedImpl } from "./message-circle-dashed"

export default { title: "Icon/Message Circle Dashed", component: MessageCircleDashedImpl }

export const MessageCircleDashed = (args: ComponentProps<typeof MessageCircleDashedImpl>) => <MessageCircleDashedImpl {...args} />
