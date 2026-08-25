import type { ComponentProps } from "react"
import { Carousel as CarouselImpl, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "./carousel"

export default { title: "Components/Carousel", component: CarouselImpl }

export const Carousel = (args: ComponentProps<typeof CarouselImpl>) => (
  <CarouselImpl {...args} className="w-64">
    <CarouselContent>
      {[1, 2, 3].map((i) => (
        <CarouselItem key={i}>
          <div className="flex h-32 items-center justify-center rounded-lg bg-muted text-2xl font-semibold">
            {i}
          </div>
        </CarouselItem>
      ))}
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </CarouselImpl>
)
