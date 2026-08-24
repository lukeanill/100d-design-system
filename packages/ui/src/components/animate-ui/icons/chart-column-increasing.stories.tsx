import type { ComponentProps } from "react"
import { ChartColumnIncreasing as ChartColumnIncreasingImpl } from "./chart-column-increasing"

export default { title: "Icon/Chart Column Increasing", component: ChartColumnIncreasingImpl }

export const ChartColumnIncreasing = (args: ComponentProps<typeof ChartColumnIncreasingImpl>) => <ChartColumnIncreasingImpl {...args} />
