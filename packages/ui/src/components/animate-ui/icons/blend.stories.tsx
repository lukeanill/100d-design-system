import type { ComponentProps } from "react"
import { Blend as BlendImpl } from "./blend"

export default {
  title: "Icon/Blend",
  component: BlendImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Blend = (args: ComponentProps<typeof BlendImpl>) => <BlendImpl {...args} />
