import type { ComponentProps } from "react"
import { ChartColumnIncreasing as ChartColumnIncreasingImpl } from "./chart-column-increasing"

export default {
  title: "Icon/Chart Column Increasing",
  component: ChartColumnIncreasingImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const ChartColumnIncreasing = (args: ComponentProps<typeof ChartColumnIncreasingImpl>) => <ChartColumnIncreasingImpl {...args} />
