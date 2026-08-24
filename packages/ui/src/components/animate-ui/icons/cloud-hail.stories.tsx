import type { ComponentProps } from "react"
import { CloudHail as CloudHailImpl } from "./cloud-hail"

export default { title: "Icon/Cloud Hail", component: CloudHailImpl }

export const CloudHail = (args: ComponentProps<typeof CloudHailImpl>) => <CloudHailImpl {...args} />
