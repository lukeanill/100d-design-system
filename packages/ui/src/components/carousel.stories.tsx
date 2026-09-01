import type { ComponentProps } from "react"
import { Carousel as CarouselImpl, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "./carousel"

export default {
  title: "Components/Content/Carousel",
  component: CarouselImpl,
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
    opts: { table: { disable: true } },
    plugins: { table: { disable: true } },
    setApi: { table: { disable: true } },
  },
  args: { orientation: "horizontal" },
}

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
