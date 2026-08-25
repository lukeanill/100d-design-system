import type { ComponentProps } from "react"
import { MessageSquareCode as MessageSquareCodeImpl } from "./message-square-code"

export default {
  title: "Icon/Message Square Code",
  component: MessageSquareCodeImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const MessageSquareCode = (args: ComponentProps<typeof MessageSquareCodeImpl>) => <MessageSquareCodeImpl {...args} />
