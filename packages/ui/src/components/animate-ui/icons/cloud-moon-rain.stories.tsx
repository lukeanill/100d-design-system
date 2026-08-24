import type { ComponentProps } from "react"
import { CloudMoonRain as CloudMoonRainImpl } from "./cloud-moon-rain"

export default { title: "Icon/Cloud Moon Rain", component: CloudMoonRainImpl }

export const CloudMoonRain = (args: ComponentProps<typeof CloudMoonRainImpl>) => <CloudMoonRainImpl {...args} />
