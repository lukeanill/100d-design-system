import type { ComponentProps } from "react"
import { CloudUpload as CloudUploadImpl } from "./cloud-upload"

export default {
  title: "Icon/Cloud Upload",
  component: CloudUploadImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const CloudUpload = (args: ComponentProps<typeof CloudUploadImpl>) => <CloudUploadImpl {...args} />
