import type { ComponentProps } from "react"
import { PlugZap as PlugZapImpl } from "./plug-zap"

export default { title: "Icon/Plug Zap", component: PlugZapImpl }

export const PlugZap = (args: ComponentProps<typeof PlugZapImpl>) => <PlugZapImpl {...args} />
