import type { ComponentProps } from "react"
import { MessageSquarePlus as MessageSquarePlusImpl } from "./message-square-plus"

export default {
  title: "Icon/Message Square Plus",
  component: MessageSquarePlusImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const MessageSquarePlus = (args: ComponentProps<typeof MessageSquarePlusImpl>) => <MessageSquarePlusImpl {...args} />
