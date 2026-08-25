import type { ComponentProps } from "react"
import { Upload as UploadImpl } from "./upload"

export default {
  title: "Icon/Upload",
  component: UploadImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Upload = (args: ComponentProps<typeof UploadImpl>) => <UploadImpl {...args} />
