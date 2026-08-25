import type { ComponentProps } from "react"
import { Layers2 as Layers2Impl } from "./layers-2"

export default {
  title: "Icon/Layers 2",
  component: Layers2Impl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Layers2 = (args: ComponentProps<typeof Layers2Impl>) => <Layers2Impl {...args} />
