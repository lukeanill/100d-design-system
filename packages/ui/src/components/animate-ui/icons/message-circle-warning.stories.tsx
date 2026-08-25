import type { ComponentProps } from "react"
import { MessageCircleWarning as MessageCircleWarningImpl } from "./message-circle-warning"

export default {
  title: "Icon/Message Circle Warning",
  component: MessageCircleWarningImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const MessageCircleWarning = (args: ComponentProps<typeof MessageCircleWarningImpl>) => <MessageCircleWarningImpl {...args} />
