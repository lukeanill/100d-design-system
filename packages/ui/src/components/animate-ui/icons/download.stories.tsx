import type { ComponentProps } from "react"
import { Download as DownloadImpl } from "./download"

export default { title: "Icon/Download", component: DownloadImpl }

export const Download = (args: ComponentProps<typeof DownloadImpl>) => <DownloadImpl {...args} />
