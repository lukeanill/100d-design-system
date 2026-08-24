import type { ComponentProps } from "react"
import { ChevronDown as ChevronDownImpl } from "./chevron-down"

export default { title: "Icon/Chevron Down", component: ChevronDownImpl }

export const ChevronDown = (args: ComponentProps<typeof ChevronDownImpl>) => <ChevronDownImpl {...args} />
