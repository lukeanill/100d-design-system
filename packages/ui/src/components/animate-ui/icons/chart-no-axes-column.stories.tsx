import type { ComponentProps } from "react"
import { ChartNoAxesColumn as ChartNoAxesColumnImpl } from "./chart-no-axes-column"

export default {
  title: "Icon/Chart No Axes Column",
  component: ChartNoAxesColumnImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const ChartNoAxesColumn = (args: ComponentProps<typeof ChartNoAxesColumnImpl>) => <ChartNoAxesColumnImpl {...args} />
