import type { ComponentProps } from "react"
import { MapSync as MapSyncImpl } from "./map-sync"

export default { title: "Map/Map Sync", component: MapSyncImpl, args: { maps: [{ label: 'A' }, { label: 'B' }] } }

export const MapSync = (args: ComponentProps<typeof MapSyncImpl>) => <MapSyncImpl {...args} />
