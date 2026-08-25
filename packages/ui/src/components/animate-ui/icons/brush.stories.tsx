import type { ComponentProps } from "react"
import { Brush as BrushImpl } from "./brush"

export default {
  title: "Icon/Brush",
  component: BrushImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Brush = (args: ComponentProps<typeof BrushImpl>) => <BrushImpl {...args} />
