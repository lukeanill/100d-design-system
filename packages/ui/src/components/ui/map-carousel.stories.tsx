import type { ComponentProps } from "react"
import { MapCarousel as MapCarouselImpl, MapCarouselContent } from "./map-carousel"

export default {
  title: "Components/Content/Map Carousel",
  component: MapCarouselImpl,
  argTypes: {
    "data.mapStyle": {
      control: "select",
      options: ["voyager", "voyager-smooth", "positron", "dark-matter", "openstreetmap"],
    },
    "data.zoom": { control: "number" },
    "data.title": { control: "text" },
    "data.locations": { table: { disable: true } },
    "data.filters": { table: { disable: true } },
    "appearance.displayMode": {
      control: "select",
      options: ["inline", "pip", "fullscreen"],
    },
    "appearance.mapHeight": { control: "text" },
    actions: { table: { disable: true } },
  },
  args: {
    appearance: { displayMode: "inline", mapHeight: "504px" },
    data: {
      center: [37.7749, -122.4194],
      locations: [
        {
          coordinates: [37.7935, -122.3938],
          image: "https://picsum.photos/seed/hotel-1/400/300",
          name: "The Embarcadero Grand",
          price: 329,
          priceLabel: "$329 per night",
          priceSubtext: "USD · Includes taxes and fees",
          rating: 9.1,
          subtitle: "Embarcadero",
        },
        {
          coordinates: [37.7925, -122.4138],
          image: "https://picsum.photos/seed/hotel-2/400/300",
          name: "Hotel Nob Hill",
          price: 275,
          priceLabel: "$275 per night",
          priceSubtext: "USD · Includes taxes and fees",
          rating: 8.7,
          subtitle: "Nob Hill",
        },
        {
          coordinates: [37.8025, -122.4382],
          image: "https://picsum.photos/seed/hotel-3/400/300",
          name: "Marina Bay Suites",
          price: 389,
          priceLabel: "$389 per night",
          priceSubtext: "USD · Includes taxes and fees",
          rating: 9.4,
          subtitle: "Marina District",
        },
        {
          coordinates: [37.7599, -122.4148],
          image: "https://picsum.photos/seed/hotel-4/400/300",
          name: "Mission Street Inn",
          price: 189,
          priceLabel: "$189 per night",
          priceSubtext: "USD · Includes taxes and fees",
          rating: 8.2,
          subtitle: "Mission District",
        },
      ],
      mapStyle: "voyager",
      title: "San Francisco Hotels",
      zoom: 13,
    },
  },
}

export const MapCarousel = (args: ComponentProps<typeof MapCarouselImpl>) => (
  <MapCarouselImpl {...args}>
    <MapCarouselContent />
  </MapCarouselImpl>
)
