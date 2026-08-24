import type { ComponentProps } from "react"
import { CloudRain as CloudRainImpl } from "./cloud-rain"

export default { title: "Icon/Cloud Rain", component: CloudRainImpl }

export const CloudRain = (args: ComponentProps<typeof CloudRainImpl>) => <CloudRainImpl {...args} />
