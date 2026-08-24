import type { ComponentProps } from "react"
import { ChartBar as ChartBarImpl } from "./chart-bar"

export default { title: "Icon/Chart Bar", component: ChartBarImpl }

export const ChartBar = (args: ComponentProps<typeof ChartBarImpl>) => <ChartBarImpl {...args} />
