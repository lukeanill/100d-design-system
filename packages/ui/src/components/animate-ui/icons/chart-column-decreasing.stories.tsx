import type { ComponentProps } from "react"
import { ChartColumnDecreasing as ChartColumnDecreasingImpl } from "./chart-column-decreasing"

export default {
  title: "Icon/Chart Column Decreasing",
  component: ChartColumnDecreasingImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const ChartColumnDecreasing = (args: ComponentProps<typeof ChartColumnDecreasingImpl>) => <ChartColumnDecreasingImpl {...args} />
