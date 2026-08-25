import type { ComponentProps } from "react"
import { MessageSquareDashed as MessageSquareDashedImpl } from "./message-square-dashed"

export default {
  title: "Icon/Message Square Dashed",
  component: MessageSquareDashedImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const MessageSquareDashed = (args: ComponentProps<typeof MessageSquareDashedImpl>) => <MessageSquareDashedImpl {...args} />
