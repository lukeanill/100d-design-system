import type { ComponentProps } from "react"
import { CloudRainWind as CloudRainWindImpl } from "./cloud-rain-wind"

export default {
  title: "Icon/Cloud Rain Wind",
  component: CloudRainWindImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const CloudRainWind = (args: ComponentProps<typeof CloudRainWindImpl>) => <CloudRainWindImpl {...args} />
