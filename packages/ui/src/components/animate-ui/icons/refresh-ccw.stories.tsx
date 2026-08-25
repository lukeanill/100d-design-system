import type { ComponentProps } from "react"
import { RefreshCcw as RefreshCcwImpl } from "./refresh-ccw"

export default {
  title: "Icon/Refresh Ccw",
  component: RefreshCcwImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const RefreshCcw = (args: ComponentProps<typeof RefreshCcwImpl>) => <RefreshCcwImpl {...args} />
