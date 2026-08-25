import type { ComponentProps } from "react"
import { MessageSquareX as MessageSquareXImpl } from "./message-square-x"

export default {
  title: "Icon/Message Square X",
  component: MessageSquareXImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const MessageSquareX = (args: ComponentProps<typeof MessageSquareXImpl>) => <MessageSquareXImpl {...args} />
