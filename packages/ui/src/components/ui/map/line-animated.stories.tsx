import type { ComponentProps } from "react"
import { MapLineAnimated as MapLineAnimatedImpl } from "./line-animated"

export default { title: "Map/Line Animated", component: MapLineAnimatedImpl }

export const LineAnimated = (args: ComponentProps<typeof MapLineAnimatedImpl>) => <MapLineAnimatedImpl {...args} />
