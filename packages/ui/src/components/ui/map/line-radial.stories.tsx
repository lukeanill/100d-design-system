import type { ComponentProps } from "react"
import { MapLineRadial as MapLineRadialImpl } from "./line-radial"

export default { title: "Map/Line Radial", component: MapLineRadialImpl }

export const LineRadial = (args: ComponentProps<typeof MapLineRadialImpl>) => <MapLineRadialImpl {...args} />
