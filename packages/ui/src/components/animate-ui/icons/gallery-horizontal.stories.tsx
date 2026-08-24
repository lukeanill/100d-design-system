import type { ComponentProps } from "react"
import { GalleryHorizontal as GalleryHorizontalImpl } from "./gallery-horizontal"

export default { title: "Icon/Gallery Horizontal", component: GalleryHorizontalImpl }

export const GalleryHorizontal = (args: ComponentProps<typeof GalleryHorizontalImpl>) => <GalleryHorizontalImpl {...args} />
