import type { ComponentProps } from "react"
import { ChartBarIncreasing as ChartBarIncreasingImpl } from "./chart-bar-increasing"

export default { title: "Icon/Chart Bar Increasing", component: ChartBarIncreasingImpl }

export const ChartBarIncreasing = (args: ComponentProps<typeof ChartBarIncreasingImpl>) => <ChartBarIncreasingImpl {...args} />
