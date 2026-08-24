import type { ComponentProps } from "react"
import { MapCircleCluster as MapCircleClusterImpl } from "./circle-cluster"

export default { title: "Map/Circle Cluster", component: MapCircleClusterImpl }

export const CircleCluster = (args: ComponentProps<typeof MapCircleClusterImpl>) => <MapCircleClusterImpl {...args} />
