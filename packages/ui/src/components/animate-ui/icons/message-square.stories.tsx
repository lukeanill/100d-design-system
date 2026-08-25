import type { ComponentProps } from "react"
import { MessageSquare as MessageSquareImpl } from "./message-square"

export default {
  title: "Icon/Message Square",
  component: MessageSquareImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const MessageSquare = (args: ComponentProps<typeof MessageSquareImpl>) => <MessageSquareImpl {...args} />
