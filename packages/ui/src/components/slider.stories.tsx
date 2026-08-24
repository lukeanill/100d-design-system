import type { ComponentProps } from "react"
import { Slider as SliderImpl } from "./slider"

export default { title: "Components/Slider", component: SliderImpl }

export const Slider = (args: ComponentProps<typeof SliderImpl>) => <SliderImpl {...args} />
