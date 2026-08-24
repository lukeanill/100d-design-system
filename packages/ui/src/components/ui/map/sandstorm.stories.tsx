import type { ComponentProps } from "react"
import { MapSandstorm as MapSandstormImpl } from "./sandstorm"

export default { title: "Map/Sandstorm", component: MapSandstormImpl }

export const Sandstorm = (args: ComponentProps<typeof MapSandstormImpl>) => <MapSandstormImpl {...args} />
