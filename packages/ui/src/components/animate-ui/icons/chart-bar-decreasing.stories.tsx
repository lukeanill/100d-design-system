import type { ComponentProps } from "react"
import { ChartBarDecreasing as ChartBarDecreasingImpl } from "./chart-bar-decreasing"

export default { title: "Icon/Chart Bar Decreasing", component: ChartBarDecreasingImpl }

export const ChartBarDecreasing = (args: ComponentProps<typeof ChartBarDecreasingImpl>) => <ChartBarDecreasingImpl {...args} />
