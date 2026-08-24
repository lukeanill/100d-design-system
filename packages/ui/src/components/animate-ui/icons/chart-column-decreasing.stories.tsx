import type { ComponentProps } from "react"
import { ChartColumnDecreasing as ChartColumnDecreasingImpl } from "./chart-column-decreasing"

export default { title: "Icon/Chart Column Decreasing", component: ChartColumnDecreasingImpl }

export const ChartColumnDecreasing = (args: ComponentProps<typeof ChartColumnDecreasingImpl>) => <ChartColumnDecreasingImpl {...args} />
