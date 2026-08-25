import type { ComponentProps } from "react"
import { MapPinOff as MapPinOffImpl } from "./map-pin-off"

export default {
  title: "Icon/Map Pin Off",
  component: MapPinOffImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const MapPinOff = (args: ComponentProps<typeof MapPinOffImpl>) => <MapPinOffImpl {...args} />
