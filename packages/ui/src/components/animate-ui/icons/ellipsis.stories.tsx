import type { ComponentProps } from "react"
import { Ellipsis as EllipsisImpl } from "./ellipsis"

export default {
  title: "Icon/Ellipsis",
  component: EllipsisImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Ellipsis = (args: ComponentProps<typeof EllipsisImpl>) => <EllipsisImpl {...args} />
