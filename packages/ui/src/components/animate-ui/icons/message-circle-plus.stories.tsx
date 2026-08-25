import type { ComponentProps } from "react"
import { MessageCirclePlus as MessageCirclePlusImpl } from "./message-circle-plus"

export default {
  title: "Icon/Message Circle Plus",
  component: MessageCirclePlusImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const MessageCirclePlus = (args: ComponentProps<typeof MessageCirclePlusImpl>) => <MessageCirclePlusImpl {...args} />
