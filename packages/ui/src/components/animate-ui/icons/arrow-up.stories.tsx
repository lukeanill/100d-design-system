import type { ComponentProps } from "react"
import { ArrowUp as ArrowUpImpl } from "./arrow-up"

export default { title: "Icon/Arrow Up", component: ArrowUpImpl }

export const ArrowUp = (args: ComponentProps<typeof ArrowUpImpl>) => <ArrowUpImpl {...args} />
