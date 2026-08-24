import type { ComponentProps } from "react"
import { GalleryVertical as GalleryVerticalImpl } from "./gallery-vertical"

export default { title: "Icon/Gallery Vertical", component: GalleryVerticalImpl }

export const GalleryVertical = (args: ComponentProps<typeof GalleryVerticalImpl>) => <GalleryVerticalImpl {...args} />
