import type { ComponentProps } from "react"
import { Layers as LayersImpl } from "./layers"

export default {
  title: "Icon/Layers",
  component: LayersImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Layers = (args: ComponentProps<typeof LayersImpl>) => <LayersImpl {...args} />
