import type { ComponentProps } from "react"
import { MessageSquareOff as MessageSquareOffImpl } from "./message-square-off"

export default {
  title: "Icon/Message Square Off",
  component: MessageSquareOffImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const MessageSquareOff = (args: ComponentProps<typeof MessageSquareOffImpl>) => <MessageSquareOffImpl {...args} />
