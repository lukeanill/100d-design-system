import type { ComponentProps } from "react"
import { MapCircle as MapCircleImpl } from "./circle"

export default { title: "Map/Circle", component: MapCircleImpl }

export const Circle = (args: ComponentProps<typeof MapCircleImpl>) => <MapCircleImpl {...args} />
