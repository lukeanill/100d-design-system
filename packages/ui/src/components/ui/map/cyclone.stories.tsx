import type { ComponentProps } from "react"
import { MapCyclone as MapCycloneImpl } from "./cyclone"

export default { title: "Map/Cyclone", component: MapCycloneImpl }

export const Cyclone = (args: ComponentProps<typeof MapCycloneImpl>) => <MapCycloneImpl {...args} />
