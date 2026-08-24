import type { ComponentProps } from "react"
import { MapAnimatedPolygon as MapAnimatedPolygonImpl } from "./animated-polygon"

export default { title: "Map/Animated Polygon", component: MapAnimatedPolygonImpl }

export const AnimatedPolygon = (args: ComponentProps<typeof MapAnimatedPolygonImpl>) => <MapAnimatedPolygonImpl {...args} />
