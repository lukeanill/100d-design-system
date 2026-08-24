import type { ComponentProps } from "react"
import { MapImage as MapImageImpl } from "./image"

export default { title: "Map/Image", component: MapImageImpl }

export const Image = (args: ComponentProps<typeof MapImageImpl>) => <MapImageImpl {...args} />
