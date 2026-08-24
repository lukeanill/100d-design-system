import type { ComponentProps } from "react"
import { MapPolygon as MapPolygonImpl } from "./polygon"

export default { title: "Map/Polygon", component: MapPolygonImpl }

export const Polygon = (args: ComponentProps<typeof MapPolygonImpl>) => <MapPolygonImpl {...args} />
