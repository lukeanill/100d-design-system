import type { ComponentProps } from "react"
import { MapCompass as MapCompassImpl } from "./compass"

export default { title: "Map/Compass", component: MapCompassImpl }

export const Compass = (args: ComponentProps<typeof MapCompassImpl>) => <MapCompassImpl {...args} />
