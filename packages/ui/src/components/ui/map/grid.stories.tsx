import type { ComponentProps } from "react"
import { MapGrid as MapGridImpl } from "./grid"

export default { title: "Map/Grid", component: MapGridImpl }

export const Grid = (args: ComponentProps<typeof MapGridImpl>) => <MapGridImpl {...args} />
