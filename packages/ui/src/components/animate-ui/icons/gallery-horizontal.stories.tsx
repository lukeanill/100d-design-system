import type { ComponentProps } from "react"
import { GalleryHorizontal as GalleryHorizontalImpl } from "./gallery-horizontal"

export default {
  title: "Icon/Gallery Horizontal",
  component: GalleryHorizontalImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const GalleryHorizontal = (args: ComponentProps<typeof GalleryHorizontalImpl>) => <GalleryHorizontalImpl {...args} />
