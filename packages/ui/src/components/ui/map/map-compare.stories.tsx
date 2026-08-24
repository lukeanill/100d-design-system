import type { ComponentProps } from "react"
import { MapCompare as MapCompareImpl } from "./map-compare"

export default { title: "Map/Map Compare", component: MapCompareImpl }

export const MapCompare = (args: ComponentProps<typeof MapCompareImpl>) => <MapCompareImpl {...args} />
