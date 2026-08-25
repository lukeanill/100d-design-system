import type { ComponentProps } from "react"
import { SlidersHorizontal as SlidersHorizontalImpl } from "./sliders-horizontal"

export default {
  title: "Icon/Sliders Horizontal",
  component: SlidersHorizontalImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const SlidersHorizontal = (args: ComponentProps<typeof SlidersHorizontalImpl>) => <SlidersHorizontalImpl {...args} />
