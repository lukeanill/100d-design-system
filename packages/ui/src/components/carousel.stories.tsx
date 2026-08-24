import type { ComponentProps } from "react"
import { Carousel as CarouselImpl } from "./carousel"

export default { title: "Components/Carousel", component: CarouselImpl }

export const Carousel = (args: ComponentProps<typeof CarouselImpl>) => <CarouselImpl {...args} />
