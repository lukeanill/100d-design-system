import type { ComponentProps } from "react"
import { Heart as HeartImpl } from "./heart"

export default {
  title: "Icon/Heart",
  component: HeartImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Heart = (args: ComponentProps<typeof HeartImpl>) => <HeartImpl {...args} />
