import type { ComponentProps } from "react"
import { ChartContainer as ChartContainerImpl } from "./chart"

export default { title: "Components/Chart", component: ChartContainerImpl }

export const Chart = (args: ComponentProps<typeof ChartContainerImpl>) => <ChartContainerImpl {...args} />
