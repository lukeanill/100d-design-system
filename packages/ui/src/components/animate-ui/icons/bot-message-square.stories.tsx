import type { ComponentProps } from "react"
import { BotMessageSquare as BotMessageSquareImpl } from "./bot-message-square"

export default { title: "Icon/Bot Message Square", component: BotMessageSquareImpl }

export const BotMessageSquare = (args: ComponentProps<typeof BotMessageSquareImpl>) => <BotMessageSquareImpl {...args} />
