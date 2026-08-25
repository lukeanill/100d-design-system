import type { ComponentProps } from "react"
import { Gauge as GaugeImpl } from "./gauge"

export default {
  title: "Icon/Gauge",
  component: GaugeImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Gauge = (args: ComponentProps<typeof GaugeImpl>) => <GaugeImpl {...args} />
