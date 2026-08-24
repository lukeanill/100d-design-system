import type { ComponentProps } from "react"
import { animations as animationsImpl } from "./gallery-horizontal-end"

export default { title: "Icon/Gallery Horizontal End", component: animationsImpl }

export const GalleryHorizontalEnd = (args: ComponentProps<typeof animationsImpl>) => <animationsImpl {...args} />
