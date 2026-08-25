import type { ComponentProps } from "react"
import { LayoutDashboard as LayoutDashboardImpl } from "./layout-dashboard"

export default {
  title: "Icon/Layout Dashboard",
  component: LayoutDashboardImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const LayoutDashboard = (args: ComponentProps<typeof LayoutDashboardImpl>) => <LayoutDashboardImpl {...args} />
