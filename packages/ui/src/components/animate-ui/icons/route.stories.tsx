import type { ComponentProps } from "react"
import { Route as RouteImpl } from "./route"

export default { title: "Icon/Route", component: RouteImpl }

export const Route = (args: ComponentProps<typeof RouteImpl>) => <RouteImpl {...args} />
