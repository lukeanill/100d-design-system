import type { ComponentProps } from "react"
import { MessageSquareQuote as MessageSquareQuoteImpl } from "./message-square-quote"

export default {
  title: "Icon/Message Square Quote",
  component: MessageSquareQuoteImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const MessageSquareQuote = (args: ComponentProps<typeof MessageSquareQuoteImpl>) => <MessageSquareQuoteImpl {...args} />
