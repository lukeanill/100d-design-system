import type { ComponentProps } from "react"
import { CloudSun as CloudSunImpl } from "./cloud-sun"

export default { title: "Icon/Cloud Sun", component: CloudSunImpl }

export const CloudSun = (args: ComponentProps<typeof CloudSunImpl>) => <CloudSunImpl {...args} />
