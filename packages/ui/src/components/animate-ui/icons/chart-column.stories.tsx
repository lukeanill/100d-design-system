import type { ComponentProps } from "react"
import { ChartColumn as ChartColumnImpl } from "./chart-column"

export default {
  title: "Icon/Chart Column",
  component: ChartColumnImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const ChartColumn = (args: ComponentProps<typeof ChartColumnImpl>) => <ChartColumnImpl {...args} />
