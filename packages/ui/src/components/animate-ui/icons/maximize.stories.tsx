import type { ComponentProps } from "react"
import { Maximize as MaximizeImpl } from "./maximize"

export default {
  title: "Icon/Maximize",
  component: MaximizeImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Maximize = (args: ComponentProps<typeof MaximizeImpl>) => <MaximizeImpl {...args} />
