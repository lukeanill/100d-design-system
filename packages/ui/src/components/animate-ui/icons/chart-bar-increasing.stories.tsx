import type { ComponentProps } from "react"
import { ChartBarIncreasing as ChartBarIncreasingImpl } from "./chart-bar-increasing"

export default {
  title: "Icon/Chart Bar Increasing",
  component: ChartBarIncreasingImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const ChartBarIncreasing = (args: ComponentProps<typeof ChartBarIncreasingImpl>) => <ChartBarIncreasingImpl {...args} />
