import type { ComponentProps } from "react"
import { animations as animationsImpl } from "./gallery-vertical-end"

export default {
  title: "Icon/Gallery Vertical End",
  component: animationsImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const GalleryVerticalEnd = (args: ComponentProps<typeof animationsImpl>) => <animationsImpl {...args} />
