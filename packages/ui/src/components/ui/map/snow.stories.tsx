import type { ComponentProps } from "react"
import { MapSnow as MapSnowImpl } from "./snow"

export default { title: "Map/Snow", component: MapSnowImpl }

export const Snow = (args: ComponentProps<typeof MapSnowImpl>) => <MapSnowImpl {...args} />
