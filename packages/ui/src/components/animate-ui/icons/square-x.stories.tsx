import type { ComponentProps } from "react"
import { SquareX as SquareXImpl } from "./square-x"

export default {
  title: "Icon/Square X",
  component: SquareXImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const SquareX = (args: ComponentProps<typeof SquareXImpl>) => <SquareXImpl {...args} />
