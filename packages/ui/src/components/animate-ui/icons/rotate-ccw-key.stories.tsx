import type { ComponentProps } from "react"
import { RotateCcwKey as RotateCcwKeyImpl } from "./rotate-ccw-key"

export default {
  title: "Icon/Rotate Ccw Key",
  component: RotateCcwKeyImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const RotateCcwKey = (args: ComponentProps<typeof RotateCcwKeyImpl>) => <RotateCcwKeyImpl {...args} />
