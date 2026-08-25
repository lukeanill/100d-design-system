import type { ComponentProps } from "react"
import { MessageSquareMore as MessageSquareMoreImpl } from "./message-square-more"

export default {
  title: "Icon/Message Square More",
  component: MessageSquareMoreImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const MessageSquareMore = (args: ComponentProps<typeof MessageSquareMoreImpl>) => <MessageSquareMoreImpl {...args} />
