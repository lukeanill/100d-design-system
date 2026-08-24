import type { ComponentProps } from "react"
import { MapMarkerAnimated as MapMarkerAnimatedImpl } from "./marker-animated"

export default { title: "Map/Marker Animated", component: MapMarkerAnimatedImpl }

export const MarkerAnimated = (args: ComponentProps<typeof MapMarkerAnimatedImpl>) => <MapMarkerAnimatedImpl {...args} />
