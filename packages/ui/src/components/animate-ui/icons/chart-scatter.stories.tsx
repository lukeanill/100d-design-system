import type { ComponentProps } from "react"
import { ChartScatter as ChartScatterImpl } from "./chart-scatter"

export default { title: "Icon/Chart Scatter", component: ChartScatterImpl }

export const ChartScatter = (args: ComponentProps<typeof ChartScatterImpl>) => <ChartScatterImpl {...args} />
