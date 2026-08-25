import type { ComponentProps } from "react"
import { ChartScatter as ChartScatterImpl } from "./chart-scatter"

export default {
  title: "Icon/Chart Scatter",
  component: ChartScatterImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const ChartScatter = (args: ComponentProps<typeof ChartScatterImpl>) => <ChartScatterImpl {...args} />
