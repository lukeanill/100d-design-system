import type { ComponentProps } from "react"
import { Plus as PlusImpl } from "./plus"

export default {
  title: "Icon/Plus",
  component: PlusImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Plus = (args: ComponentProps<typeof PlusImpl>) => <PlusImpl {...args} />
