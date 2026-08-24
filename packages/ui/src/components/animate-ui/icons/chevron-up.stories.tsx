import type { ComponentProps } from "react"
import { ChevronUp as ChevronUpImpl } from "./chevron-up"

export default { title: "Icon/Chevron Up", component: ChevronUpImpl }

export const ChevronUp = (args: ComponentProps<typeof ChevronUpImpl>) => <ChevronUpImpl {...args} />
