import type { ComponentProps } from "react"
import { ChartLine as ChartLineImpl } from "./chart-line"

export default {
  title: "Icon/Chart Line",
  component: ChartLineImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const ChartLine = (args: ComponentProps<typeof ChartLineImpl>) => <ChartLineImpl {...args} />
