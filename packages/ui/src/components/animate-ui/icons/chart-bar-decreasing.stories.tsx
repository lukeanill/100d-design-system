import type { ComponentProps } from "react"
import { ChartBarDecreasing as ChartBarDecreasingImpl } from "./chart-bar-decreasing"

export default {
  title: "Icon/Chart Bar Decreasing",
  component: ChartBarDecreasingImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const ChartBarDecreasing = (args: ComponentProps<typeof ChartBarDecreasingImpl>) => <ChartBarDecreasingImpl {...args} />
