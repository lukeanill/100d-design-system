import type { ComponentProps } from "react"
import { MapPin as MapPinImpl } from "./map-pin"

export default {
  title: "Icon/Map Pin",
  component: MapPinImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const MapPin = (args: ComponentProps<typeof MapPinImpl>) => <MapPinImpl {...args} />
