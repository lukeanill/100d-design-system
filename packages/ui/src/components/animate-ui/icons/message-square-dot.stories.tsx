import type { ComponentProps } from "react"
import { MessageSquareDot as MessageSquareDotImpl } from "./message-square-dot"

export default {
  title: "Icon/Message Square Dot",
  component: MessageSquareDotImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const MessageSquareDot = (args: ComponentProps<typeof MessageSquareDotImpl>) => <MessageSquareDotImpl {...args} />
