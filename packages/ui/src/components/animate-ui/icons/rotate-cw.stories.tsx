import type { ComponentProps } from "react"
import { RotateCw as RotateCwImpl } from "./rotate-cw"

export default {
  title: "Icon/Rotate Cw",
  component: RotateCwImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const RotateCw = (args: ComponentProps<typeof RotateCwImpl>) => <RotateCwImpl {...args} />
