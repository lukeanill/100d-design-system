import type { ComponentProps } from "react"
import { MapRadar as MapRadarImpl } from "./radar"

export default { title: "Map/Radar", component: MapRadarImpl }

export const Radar = (args: ComponentProps<typeof MapRadarImpl>) => <MapRadarImpl {...args} />
