import type { ComponentProps } from "react"
import { MapWatermark as MapWatermarkImpl } from "./watermark"

export default { title: "Map/Watermark", component: MapWatermarkImpl }

export const Watermark = (args: ComponentProps<typeof MapWatermarkImpl>) => <MapWatermarkImpl {...args} />
