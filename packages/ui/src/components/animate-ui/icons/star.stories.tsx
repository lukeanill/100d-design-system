import type { ComponentProps } from "react"
import { Star as StarImpl } from "./star"

export default {
  title: "Icon/Star",
  component: StarImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Star = (args: ComponentProps<typeof StarImpl>) => <StarImpl {...args} />
