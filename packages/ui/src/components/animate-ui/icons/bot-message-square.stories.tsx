import type { ComponentProps } from "react"
import { BotMessageSquare as BotMessageSquareImpl } from "./bot-message-square"

export default {
  title: "Icon/Bot Message Square",
  component: BotMessageSquareImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const BotMessageSquare = (args: ComponentProps<typeof BotMessageSquareImpl>) => <BotMessageSquareImpl {...args} />
