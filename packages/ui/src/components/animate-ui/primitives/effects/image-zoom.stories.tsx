import type { ComponentProps } from "react"
import { ImageZoom as ImageZoomImpl } from "./image-zoom"

export default { title: "Animation/Image Zoom (Effects)", component: ImageZoomImpl }

export const ImageZoom = (args: ComponentProps<typeof ImageZoomImpl>) => <ImageZoomImpl {...args} />
