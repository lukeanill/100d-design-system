import type { ComponentProps } from "react"
import { MapRasterVideo as MapRasterVideoImpl } from "./raster-video"

export default { title: "Map/Raster Video", component: MapRasterVideoImpl }

export const RasterVideo = (args: ComponentProps<typeof MapRasterVideoImpl>) => <MapRasterVideoImpl {...args} />
