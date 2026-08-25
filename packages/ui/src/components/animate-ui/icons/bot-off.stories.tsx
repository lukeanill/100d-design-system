import type { ComponentProps } from "react"
import { BotOff as BotOffImpl } from "./bot-off"

export default {
  title: "Icon/Bot Off",
  component: BotOffImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const BotOff = (args: ComponentProps<typeof BotOffImpl>) => <BotOffImpl {...args} />
