import type { ComponentProps } from "react"
import { RefreshCw as RefreshCwImpl } from "./refresh-cw"

export default {
  title: "Icon/Refresh Cw",
  component: RefreshCwImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const RefreshCw = (args: ComponentProps<typeof RefreshCwImpl>) => <RefreshCwImpl {...args} />
