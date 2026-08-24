import type { ComponentProps } from "react"
import { CloudLightning as CloudLightningImpl } from "./cloud-lightning"

export default { title: "Icon/Cloud Lightning", component: CloudLightningImpl }

export const CloudLightning = (args: ComponentProps<typeof CloudLightningImpl>) => <CloudLightningImpl {...args} />
