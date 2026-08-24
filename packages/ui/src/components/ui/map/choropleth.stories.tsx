import type { ComponentProps } from "react"
import { MapChoropleth as MapChoroplethImpl } from "./choropleth"

export default { title: "Map/Choropleth", component: MapChoroplethImpl }

export const Choropleth = (args: ComponentProps<typeof MapChoroplethImpl>) => <MapChoroplethImpl {...args} />
