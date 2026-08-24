import type { ComponentProps } from "react"
import { MapAnimatedCircle as MapAnimatedCircleImpl } from "./animated-circle"

export default { title: "Map/Animated Circle", component: MapAnimatedCircleImpl }

export const AnimatedCircle = (args: ComponentProps<typeof MapAnimatedCircleImpl>) => <MapAnimatedCircleImpl {...args} />
