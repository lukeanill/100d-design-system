import type { ComponentProps } from "react"
import { ChartNoAxesColumnIncreasing as ChartNoAxesColumnIncreasingImpl } from "./chart-no-axes-column-increasing"

export default {
  title: "Icon/Chart No Axes Column Increasing",
  component: ChartNoAxesColumnIncreasingImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const ChartNoAxesColumnIncreasing = (args: ComponentProps<typeof ChartNoAxesColumnIncreasingImpl>) => <ChartNoAxesColumnIncreasingImpl {...args} />
