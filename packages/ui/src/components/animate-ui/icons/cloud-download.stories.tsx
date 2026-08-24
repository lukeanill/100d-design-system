import type { ComponentProps } from "react"
import { CloudDownload as CloudDownloadImpl } from "./cloud-download"

export default { title: "Icon/Cloud Download", component: CloudDownloadImpl }

export const CloudDownload = (args: ComponentProps<typeof CloudDownloadImpl>) => <CloudDownloadImpl {...args} />
