import type { ComponentProps } from "react"
import { RotateCcw as RotateCcwImpl } from "./rotate-ccw"

export default {
  title: "Icon/Rotate Ccw",
  component: RotateCcwImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const RotateCcw = (args: ComponentProps<typeof RotateCcwImpl>) => <RotateCcwImpl {...args} />
