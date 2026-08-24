import type { ComponentProps } from "react"
import { MapCarousel as MapCarouselImpl } from "./map-carousel"

export default { title: "Components/Map Carousel", component: MapCarouselImpl }

export const MapCarousel = (args: ComponentProps<typeof MapCarouselImpl>) => <MapCarouselImpl {...args} />
