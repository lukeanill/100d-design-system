import type { ComponentProps } from "react"
import { GalleryVertical as GalleryVerticalImpl } from "./gallery-vertical"

export default {
  title: "Icon/Gallery Vertical",
  component: GalleryVerticalImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const GalleryVertical = (args: ComponentProps<typeof GalleryVerticalImpl>) => <GalleryVerticalImpl {...args} />
