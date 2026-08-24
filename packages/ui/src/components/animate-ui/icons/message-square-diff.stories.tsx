import type { ComponentProps } from "react"
import { MessageSquareDiff as MessageSquareDiffImpl } from "./message-square-diff"

export default { title: "Icon/Message Square Diff", component: MessageSquareDiffImpl }

export const MessageSquareDiff = (args: ComponentProps<typeof MessageSquareDiffImpl>) => <MessageSquareDiffImpl {...args} />
