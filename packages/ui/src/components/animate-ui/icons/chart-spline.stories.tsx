import type { ComponentProps } from "react"
import { ChartSpline as ChartSplineImpl } from "./chart-spline"

export default { title: "Icon/Chart Spline", component: ChartSplineImpl }

export const ChartSpline = (args: ComponentProps<typeof ChartSplineImpl>) => <ChartSplineImpl {...args} />
