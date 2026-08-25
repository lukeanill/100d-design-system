import type { ComponentProps } from "react"
import { PlugZap as PlugZapImpl } from "./plug-zap"

export default {
  title: "Icon/Plug Zap",
  component: PlugZapImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const PlugZap = (args: ComponentProps<typeof PlugZapImpl>) => <PlugZapImpl {...args} />
