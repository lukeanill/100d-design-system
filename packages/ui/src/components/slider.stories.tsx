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
    min: { control: { type: "number" } },
    max: { control: { type: "number" } },
    step: { control: { type: "number" } },
    disabled: { control: "boolean" },
  },
  args: {
    defaultValue: [50],
    min: 0,
    max: 100,
    step: 1,
    orientation: "horizontal",
    disabled: false,
  },
}

export const Slider = (args: ComponentProps<typeof SliderImpl>) => <SliderImpl {...args} className="w-64" />
