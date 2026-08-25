import type { ComponentProps } from "react"
import { MessageCircleQuestion as MessageCircleQuestionImpl } from "./message-circle-question"

export default {
  title: "Icon/Message Circle Question",
  component: MessageCircleQuestionImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const MessageCircleQuestion = (args: ComponentProps<typeof MessageCircleQuestionImpl>) => <MessageCircleQuestionImpl {...args} />
