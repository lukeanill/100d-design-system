import type { ComponentProps } from "react"
import { MapAnimatedFootprint as MapAnimatedFootprintImpl } from "./animated-footprint"

export default { title: "Map/Animated Footprint", component: MapAnimatedFootprintImpl, args: { path: [[-122.42, 37.77], [-122.41, 37.78], [-122.40, 37.79]] } }

export const AnimatedFootprint = (args: ComponentProps<typeof MapAnimatedFootprintImpl>) => <MapAnimatedFootprintImpl {...args} />
