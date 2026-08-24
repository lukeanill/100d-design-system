import type { ComponentProps } from "react"
import { CloudMoon as CloudMoonImpl } from "./cloud-moon"

export default { title: "Icon/Cloud Moon", component: CloudMoonImpl }

export const CloudMoon = (args: ComponentProps<typeof CloudMoonImpl>) => <CloudMoonImpl {...args} />
