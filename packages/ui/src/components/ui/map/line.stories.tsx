import type { ComponentProps } from "react"
import { MapLine as MapLineImpl } from "./line"

export default { title: "Map/Line", component: MapLineImpl }

export const Line = (args: ComponentProps<typeof MapLineImpl>) => <MapLineImpl {...args} />
