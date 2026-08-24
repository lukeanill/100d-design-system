import type { ComponentProps } from "react"
import { animations as animationsImpl } from "./gallery-vertical-end"

export default { title: "Icon/Gallery Vertical End", component: animationsImpl }

export const GalleryVerticalEnd = (args: ComponentProps<typeof animationsImpl>) => <animationsImpl {...args} />
