import type { ComponentProps } from "react"
import { ArrowUpDown as ArrowUpDownImpl } from "./arrow-up-down"

export default { title: "Icon/Arrow Up Down", component: ArrowUpDownImpl }

export const ArrowUpDown = (args: ComponentProps<typeof ArrowUpDownImpl>) => <ArrowUpDownImpl {...args} />
