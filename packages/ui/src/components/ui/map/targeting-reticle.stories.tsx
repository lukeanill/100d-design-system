import type { ComponentProps } from "react"
import { MapTargetingReticle as MapTargetingReticleImpl } from "./targeting-reticle"

export default { title: "Map/Targeting Reticle", component: MapTargetingReticleImpl }

export const TargetingReticle = (args: ComponentProps<typeof MapTargetingReticleImpl>) => <MapTargetingReticleImpl {...args} />
