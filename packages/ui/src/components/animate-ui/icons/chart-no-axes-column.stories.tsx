import type { ComponentProps } from "react"
import { ChartNoAxesColumn as ChartNoAxesColumnImpl } from "./chart-no-axes-column"

export default { title: "Icon/Chart No Axes Column", component: ChartNoAxesColumnImpl }

export const ChartNoAxesColumn = (args: ComponentProps<typeof ChartNoAxesColumnImpl>) => <ChartNoAxesColumnImpl {...args} />
