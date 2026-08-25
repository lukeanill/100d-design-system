import type { ComponentProps } from "react"
import { Paintbrush as PaintbrushImpl } from "./paintbrush"

export default {
  title: "Icon/Paintbrush",
  component: PaintbrushImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Paintbrush = (args: ComponentProps<typeof PaintbrushImpl>) => <PaintbrushImpl {...args} />
