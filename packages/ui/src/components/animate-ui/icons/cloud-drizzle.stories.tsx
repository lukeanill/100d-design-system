import type { ComponentProps } from "react"
import { CloudDrizzle as CloudDrizzleImpl } from "./cloud-drizzle"

export default { title: "Icon/Cloud Drizzle", component: CloudDrizzleImpl }

export const CloudDrizzle = (args: ComponentProps<typeof CloudDrizzleImpl>) => <CloudDrizzleImpl {...args} />
