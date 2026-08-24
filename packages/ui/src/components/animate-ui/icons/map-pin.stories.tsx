import type { ComponentProps } from "react"
import { MapPin as MapPinImpl } from "./map-pin"

export default { title: "Icon/Map Pin", component: MapPinImpl }

export const MapPin = (args: ComponentProps<typeof MapPinImpl>) => <MapPinImpl {...args} />
