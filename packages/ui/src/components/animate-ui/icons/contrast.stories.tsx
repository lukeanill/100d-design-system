import type { ComponentProps } from "react"
import { Contrast as ContrastImpl } from "./contrast"

export default {
  title: "Icon/Contrast",
  component: ContrastImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Contrast = (args: ComponentProps<typeof ContrastImpl>) => <ContrastImpl {...args} />
