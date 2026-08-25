import type { ComponentProps } from "react"
import { Bot as BotImpl } from "./bot"

export default {
  title: "Icon/Bot",
  component: BotImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Bot = (args: ComponentProps<typeof BotImpl>) => <BotImpl {...args} />
