import type { ComponentProps } from "react"
import { ChevronLeft as ChevronLeftImpl } from "./chevron-left"

export default { title: "Icon/Chevron Left", component: ChevronLeftImpl }

export const ChevronLeft = (args: ComponentProps<typeof ChevronLeftImpl>) => <ChevronLeftImpl {...args} />
