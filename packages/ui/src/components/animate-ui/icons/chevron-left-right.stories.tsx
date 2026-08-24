import type { ComponentProps } from "react"
import { ChevronLeftRight as ChevronLeftRightImpl } from "./chevron-left-right"

export default { title: "Icon/Chevron Left Right", component: ChevronLeftRightImpl }

export const ChevronLeftRight = (args: ComponentProps<typeof ChevronLeftRightImpl>) => <ChevronLeftRightImpl {...args} />
