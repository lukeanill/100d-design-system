import type { ComponentProps } from "react"
import { Map as MapImpl } from "./map"

export default { title: "Map/Map", component: MapImpl }

export const Map = (args: ComponentProps<typeof MapImpl>) => <MapImpl {...args} />
