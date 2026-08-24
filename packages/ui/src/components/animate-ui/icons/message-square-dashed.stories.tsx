import type { ComponentProps } from "react"
import { MessageSquareDashed as MessageSquareDashedImpl } from "./message-square-dashed"

export default { title: "Icon/Message Square Dashed", component: MessageSquareDashedImpl }

export const MessageSquareDashed = (args: ComponentProps<typeof MessageSquareDashedImpl>) => <MessageSquareDashedImpl {...args} />
