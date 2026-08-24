import type { ComponentProps } from "react"
import { CloudSnow as CloudSnowImpl } from "./cloud-snow"

export default { title: "Icon/Cloud Snow", component: CloudSnowImpl }

export const CloudSnow = (args: ComponentProps<typeof CloudSnowImpl>) => <CloudSnowImpl {...args} />
