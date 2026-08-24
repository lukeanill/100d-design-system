import type { ComponentProps } from "react"
import { MessageCircleQuestion as MessageCircleQuestionImpl } from "./message-circle-question"

export default { title: "Icon/Message Circle Question", component: MessageCircleQuestionImpl }

export const MessageCircleQuestion = (args: ComponentProps<typeof MessageCircleQuestionImpl>) => <MessageCircleQuestionImpl {...args} />
