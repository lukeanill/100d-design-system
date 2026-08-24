import type { ComponentProps } from "react"
import { SlidersVertical as SlidersVerticalImpl } from "./sliders-vertical"

export default { title: "Icon/Sliders Vertical", component: SlidersVerticalImpl }

export const SlidersVertical = (args: ComponentProps<typeof SlidersVerticalImpl>) => <SlidersVerticalImpl {...args} />
