import type { ComponentProps } from "react"
import { CircleX as CircleXImpl } from "./circle-x"

export default {
  title: "Icon/Circle X",
  component: CircleXImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const CircleX = (args: ComponentProps<typeof CircleXImpl>) => <CircleXImpl {...args} />
