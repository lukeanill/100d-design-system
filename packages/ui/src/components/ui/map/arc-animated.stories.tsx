import type { ComponentProps } from "react"
import { MapArcAnimated as MapArcAnimatedImpl } from "./arc-animated"

export default { title: "Map/Arc Animated", component: MapArcAnimatedImpl }

export const ArcAnimated = (args: ComponentProps<typeof MapArcAnimatedImpl>) => <MapArcAnimatedImpl {...args} />
