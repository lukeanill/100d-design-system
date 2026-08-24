import type { ComponentProps } from "react"
import { MapPinOff as MapPinOffImpl } from "./map-pin-off"

export default { title: "Icon/Map Pin Off", component: MapPinOffImpl }

export const MapPinOff = (args: ComponentProps<typeof MapPinOffImpl>) => <MapPinOffImpl {...args} />
