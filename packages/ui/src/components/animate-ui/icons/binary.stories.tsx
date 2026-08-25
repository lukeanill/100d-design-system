import type { ComponentProps } from "react"
import { Binary as BinaryImpl } from "./binary"

export default {
  title: "Icon/Binary",
  component: BinaryImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Binary = (args: ComponentProps<typeof BinaryImpl>) => <BinaryImpl {...args} />
