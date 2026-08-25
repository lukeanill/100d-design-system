import type { ComponentProps } from "react"
import { Cross as CrossImpl } from "./cross"

export default {
  title: "Icon/Cross",
  component: CrossImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Cross = (args: ComponentProps<typeof CrossImpl>) => <CrossImpl {...args} />
