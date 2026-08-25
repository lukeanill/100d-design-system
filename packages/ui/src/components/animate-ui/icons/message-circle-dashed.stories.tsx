import type { ComponentProps } from "react"
import { MessageCircleDashed as MessageCircleDashedImpl } from "./message-circle-dashed"

export default {
  title: "Icon/Message Circle Dashed",
  component: MessageCircleDashedImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const MessageCircleDashed = (args: ComponentProps<typeof MessageCircleDashedImpl>) => <MessageCircleDashedImpl {...args} />
