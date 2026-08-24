import type { ComponentProps } from "react"
import { ChartLine as ChartLineImpl } from "./chart-line"

export default { title: "Icon/Chart Line", component: ChartLineImpl }

export const ChartLine = (args: ComponentProps<typeof ChartLineImpl>) => <ChartLineImpl {...args} />
