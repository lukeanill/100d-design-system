import type { ComponentProps } from "react"
import { ChartColumn as ChartColumnImpl } from "./chart-column"

export default { title: "Icon/Chart Column", component: ChartColumnImpl }

export const ChartColumn = (args: ComponentProps<typeof ChartColumnImpl>) => <ChartColumnImpl {...args} />
