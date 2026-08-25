import type { ComponentProps } from "react"
import { MessageCircleCode as MessageCircleCodeImpl } from "./message-circle-code"

export default {
  title: "Icon/Message Circle Code",
  component: MessageCircleCodeImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const MessageCircleCode = (args: ComponentProps<typeof MessageCircleCodeImpl>) => <MessageCircleCodeImpl {...args} />
