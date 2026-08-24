import type { ComponentProps } from "react"
import { MapMiniMap as MapMiniMapImpl } from "./mini-map"

export default { title: "Map/Mini Map", component: MapMiniMapImpl }

export const MiniMap = (args: ComponentProps<typeof MapMiniMapImpl>) => <MapMiniMapImpl {...args} />
