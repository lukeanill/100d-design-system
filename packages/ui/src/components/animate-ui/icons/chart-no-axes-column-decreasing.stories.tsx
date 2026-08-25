import type { ComponentProps } from "react"
import { ChartNoAxesColumnDecreasing as ChartNoAxesColumnDecreasingImpl } from "./chart-no-axes-column-decreasing"

export default {
  title: "Icon/Chart No Axes Column Decreasing",
  component: ChartNoAxesColumnDecreasingImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const ChartNoAxesColumnDecreasing = (args: ComponentProps<typeof ChartNoAxesColumnDecreasingImpl>) => <ChartNoAxesColumnDecreasingImpl {...args} />
