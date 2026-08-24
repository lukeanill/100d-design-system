import type { ComponentProps } from "react"
import { BotOff as BotOffImpl } from "./bot-off"

export default { title: "Icon/Bot Off", component: BotOffImpl }

export const BotOff = (args: ComponentProps<typeof BotOffImpl>) => <BotOffImpl {...args} />
