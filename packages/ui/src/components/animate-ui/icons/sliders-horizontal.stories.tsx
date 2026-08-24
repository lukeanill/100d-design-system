import type { ComponentProps } from "react"
import { SlidersHorizontal as SlidersHorizontalImpl } from "./sliders-horizontal"

export default { title: "Icon/Sliders Horizontal", component: SlidersHorizontalImpl }

export const SlidersHorizontal = (args: ComponentProps<typeof SlidersHorizontalImpl>) => <SlidersHorizontalImpl {...args} />
