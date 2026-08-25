import type { ComponentProps } from "react"
import { SlidersVertical as SlidersVerticalImpl } from "./sliders-vertical"

export default {
  title: "Icon/Sliders Vertical",
  component: SlidersVerticalImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const SlidersVertical = (args: ComponentProps<typeof SlidersVerticalImpl>) => <SlidersVerticalImpl {...args} />
