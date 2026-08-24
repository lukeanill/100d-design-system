import type { ComponentProps } from "react"
import { Bot as BotImpl } from "./bot"

export default { title: "Icon/Bot", component: BotImpl }

export const Bot = (args: ComponentProps<typeof BotImpl>) => <BotImpl {...args} />
