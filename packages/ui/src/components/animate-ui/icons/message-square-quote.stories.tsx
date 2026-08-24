import type { ComponentProps } from "react"
import { MessageSquareQuote as MessageSquareQuoteImpl } from "./message-square-quote"

export default { title: "Icon/Message Square Quote", component: MessageSquareQuoteImpl }

export const MessageSquareQuote = (args: ComponentProps<typeof MessageSquareQuoteImpl>) => <MessageSquareQuoteImpl {...args} />
