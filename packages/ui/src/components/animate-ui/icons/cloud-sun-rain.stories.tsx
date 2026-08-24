import type { ComponentProps } from "react"
import { CloudSunRain as CloudSunRainImpl } from "./cloud-sun-rain"

export default { title: "Icon/Cloud Sun Rain", component: CloudSunRainImpl }

export const CloudSunRain = (args: ComponentProps<typeof CloudSunRainImpl>) => <CloudSunRainImpl {...args} />
