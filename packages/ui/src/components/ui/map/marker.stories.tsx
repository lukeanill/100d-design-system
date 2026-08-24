import type { ComponentProps } from "react"
import { MapMarker as MapMarkerImpl } from "./marker"

export default { title: "Map/Marker", component: MapMarkerImpl }

export const Marker = (args: ComponentProps<typeof MapMarkerImpl>) => <MapMarkerImpl {...args} />
