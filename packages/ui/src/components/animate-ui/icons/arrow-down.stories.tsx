import type { ComponentProps } from "react"
import { ArrowDown as ArrowDownImpl } from "./arrow-down"

export default { title: "Icon/Arrow Down", component: ArrowDownImpl }

export const ArrowDown = (args: ComponentProps<typeof ArrowDownImpl>) => <ArrowDownImpl {...args} />
