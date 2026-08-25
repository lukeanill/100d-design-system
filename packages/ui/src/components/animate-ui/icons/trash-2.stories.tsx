import type { ComponentProps } from "react"
import { Trash2 as Trash2Impl } from "./trash-2"

export default {
  title: "Icon/Trash 2",
  component: Trash2Impl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Trash2 = (args: ComponentProps<typeof Trash2Impl>) => <Trash2Impl {...args} />
