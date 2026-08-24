import type { ComponentProps } from "react"
import { ChevronRight as ChevronRightImpl } from "./chevron-right"

export default { title: "Icon/Chevron Right", component: ChevronRightImpl }

export const ChevronRight = (args: ComponentProps<typeof ChevronRightImpl>) => <ChevronRightImpl {...args} />
