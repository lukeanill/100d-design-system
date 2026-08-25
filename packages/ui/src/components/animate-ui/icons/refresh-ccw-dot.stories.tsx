import type { ComponentProps } from "react"
import { animations as animationsImpl } from "./refresh-ccw-dot"

export default {
  title: "Icon/Refresh Ccw Dot",
  component: animationsImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const RefreshCcwDot = (args: ComponentProps<typeof animationsImpl>) => <animationsImpl {...args} />
