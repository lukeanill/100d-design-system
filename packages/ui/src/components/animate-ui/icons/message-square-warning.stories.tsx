import type { ComponentProps } from "react"
import { MessageSquareWarning as MessageSquareWarningImpl } from "./message-square-warning"

export default {
  title: "Icon/Message Square Warning",
  component: MessageSquareWarningImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const MessageSquareWarning = (args: ComponentProps<typeof MessageSquareWarningImpl>) => <MessageSquareWarningImpl {...args} />
