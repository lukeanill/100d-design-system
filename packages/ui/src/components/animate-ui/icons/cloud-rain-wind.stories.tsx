import type { ComponentProps } from "react"
import { CloudRainWind as CloudRainWindImpl } from "./cloud-rain-wind"

export default { title: "Icon/Cloud Rain Wind", component: CloudRainWindImpl }

export const CloudRainWind = (args: ComponentProps<typeof CloudRainWindImpl>) => <CloudRainWindImpl {...args} />
