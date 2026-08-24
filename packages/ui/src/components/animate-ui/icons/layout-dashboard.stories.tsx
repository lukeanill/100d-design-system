import type { ComponentProps } from "react"
import { LayoutDashboard as LayoutDashboardImpl } from "./layout-dashboard"

export default { title: "Icon/Layout Dashboard", component: LayoutDashboardImpl }

export const LayoutDashboard = (args: ComponentProps<typeof LayoutDashboardImpl>) => <LayoutDashboardImpl {...args} />
