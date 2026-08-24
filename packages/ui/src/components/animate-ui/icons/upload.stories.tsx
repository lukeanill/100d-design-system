import type { ComponentProps } from "react"
import { Upload as UploadImpl } from "./upload"

export default { title: "Icon/Upload", component: UploadImpl }

export const Upload = (args: ComponentProps<typeof UploadImpl>) => <UploadImpl {...args} />
