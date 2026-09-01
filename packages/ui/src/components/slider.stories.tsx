import type { ComponentProps } from "react"
import { Slider as SliderImpl } from "./slider"

export default {
  title: "Components/Selects/Slider",
  component: SliderImpl,
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
  },
  args: { defaultValue: [50], max: 100, step: 1, orientation: "horizontal" },
}

export const Slider = (args: ComponentProps<typeof SliderImpl>) => <SliderImpl {...args} className="w-64" />
