import type { ComponentProps } from "react"
import { ChartBar as ChartBarImpl } from "./chart-bar"

export default {
  title: "Icon/Chart Bar",
  component: ChartBarImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const ChartBar = (args: ComponentProps<typeof ChartBarImpl>) => <ChartBarImpl {...args} />
