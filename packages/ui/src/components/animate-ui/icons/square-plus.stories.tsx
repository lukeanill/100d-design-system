import type { ComponentProps } from "react"
import { SquarePlus as SquarePlusImpl } from "./square-plus"

export default {
  title: "Icon/Square Plus",
  component: SquarePlusImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const SquarePlus = (args: ComponentProps<typeof SquarePlusImpl>) => <SquarePlusImpl {...args} />
