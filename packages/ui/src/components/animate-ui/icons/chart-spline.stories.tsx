import type { ComponentProps } from "react"
import { ChartSpline as ChartSplineImpl } from "./chart-spline"

export default {
  title: "Icon/Chart Spline",
  component: ChartSplineImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const ChartSpline = (args: ComponentProps<typeof ChartSplineImpl>) => <ChartSplineImpl {...args} />
