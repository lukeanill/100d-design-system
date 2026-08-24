import type { ComponentProps } from "react"
import { QuickReply as QuickReplyImpl } from "./quick-reply"

export default { title: "Components/Quick Reply", component: QuickReplyImpl }

export const QuickReply = (args: ComponentProps<typeof QuickReplyImpl>) => <QuickReplyImpl {...args} />
