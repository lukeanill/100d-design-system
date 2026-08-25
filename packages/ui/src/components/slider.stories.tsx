import type { ComponentProps } from "react"
import { Slider as SliderImpl } from "./slider"

export default {
  title: "Components/Slider",
  component: SliderImpl,
  args: { defaultValue: [50], max: 100, step: 1 },
}

export const Slider = (args: ComponentProps<typeof SliderImpl>) => <SliderImpl {...args} className="w-64" />
