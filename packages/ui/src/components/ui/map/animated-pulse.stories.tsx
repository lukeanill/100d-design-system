import type { ComponentProps } from "react"
import { MapAnimatedPulse as MapAnimatedPulseImpl } from "./animated-pulse"

export default { title: "Map/Animated Pulse", component: MapAnimatedPulseImpl }

export const AnimatedPulse = (args: ComponentProps<typeof MapAnimatedPulseImpl>) => <MapAnimatedPulseImpl {...args} />
