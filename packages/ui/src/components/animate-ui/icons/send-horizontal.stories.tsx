import type { ComponentProps } from "react"
import { SendHorizontal as SendHorizontalImpl } from "./send-horizontal"

export default { title: "Icon/Send Horizontal", component: SendHorizontalImpl }

export const SendHorizontal = (args: ComponentProps<typeof SendHorizontalImpl>) => <SendHorizontalImpl {...args} />
