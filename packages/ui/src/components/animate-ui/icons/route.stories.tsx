import type { ComponentProps } from "react"
import { Route as RouteImpl } from "./route"

export default {
  title: "Icon/Route",
  component: RouteImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Route = (args: ComponentProps<typeof RouteImpl>) => <RouteImpl {...args} />
