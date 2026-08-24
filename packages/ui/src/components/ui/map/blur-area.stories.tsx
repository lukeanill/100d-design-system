import type { ComponentProps } from "react"
import { MapBlurArea as MapBlurAreaImpl } from "./blur-area"

export default { title: "Map/Blur Area", component: MapBlurAreaImpl }

export const BlurArea = (args: ComponentProps<typeof MapBlurAreaImpl>) => <MapBlurAreaImpl {...args} />
