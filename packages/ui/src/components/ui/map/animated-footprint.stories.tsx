import type { ComponentProps } from "react"
import { MapAnimatedFootprint as MapAnimatedFootprintImpl } from "./animated-footprint"

export default { title: "Map/Animated Footprint", component: MapAnimatedFootprintImpl }

export const AnimatedFootprint = (args: ComponentProps<typeof MapAnimatedFootprintImpl>) => <MapAnimatedFootprintImpl {...args} />
