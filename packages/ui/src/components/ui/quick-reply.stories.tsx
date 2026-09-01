import type { ComponentProps } from "react"
import { QuickReply as QuickReplyImpl, QuickReplyList } from "./quick-reply"

export default {
  title: "Components/Actions/Quick Reply",
  component: QuickReplyImpl,
  argTypes: {
    "data.replies": { table: { disable: true } },
    actions: { table: { disable: true } },
  },
  args: {
    data: {
      replies: [
        { label: "Yes, please" },
        { label: "No, thanks" },
        { label: "Tell me more" },
      ],
    },
  },
}

export const QuickReply = (args: ComponentProps<typeof QuickReplyImpl>) => (
  <QuickReplyImpl {...args}>
    <QuickReplyList />
  </QuickReplyImpl>
)
