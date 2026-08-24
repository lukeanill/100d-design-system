import type { ComponentProps } from "react"
import { Send as SendImpl } from "./send"

export default { title: "Icon/Send", component: SendImpl }

export const Send = (args: ComponentProps<typeof SendImpl>) => <SendImpl {...args} />
