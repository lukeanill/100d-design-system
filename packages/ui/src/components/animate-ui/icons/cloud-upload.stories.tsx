import type { ComponentProps } from "react"
import { CloudUpload as CloudUploadImpl } from "./cloud-upload"

export default { title: "Icon/Cloud Upload", component: CloudUploadImpl }

export const CloudUpload = (args: ComponentProps<typeof CloudUploadImpl>) => <CloudUploadImpl {...args} />
