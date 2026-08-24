import type { ComponentProps } from "react"
import { MapSync as MapSyncImpl } from "./map-sync"

export default { title: "Map/Map Sync", component: MapSyncImpl }

export const MapSync = (args: ComponentProps<typeof MapSyncImpl>) => <MapSyncImpl {...args} />
