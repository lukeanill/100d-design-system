import type { ComponentProps } from "react"
import { EllipsisVertical as EllipsisVerticalImpl } from "./ellipsis-vertical"

export default {
  title: "Icon/Ellipsis Vertical",
  component: EllipsisVerticalImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const EllipsisVertical = (args: ComponentProps<typeof EllipsisVerticalImpl>) => <EllipsisVerticalImpl {...args} />
