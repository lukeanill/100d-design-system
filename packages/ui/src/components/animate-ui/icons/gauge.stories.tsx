import type { ComponentProps } from "react"
import { Gauge as GaugeImpl } from "./gauge"

export default { title: "Icon/Gauge", component: GaugeImpl }

export const Gauge = (args: ComponentProps<typeof GaugeImpl>) => <GaugeImpl {...args} />
