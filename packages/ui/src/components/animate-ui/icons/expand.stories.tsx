import type { ComponentProps } from "react"
import { Expand as ExpandImpl } from "./expand"

export default {
  title: "Icon/Expand",
  component: ExpandImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Expand = (args: ComponentProps<typeof ExpandImpl>) => <ExpandImpl {...args} />
