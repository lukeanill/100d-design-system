import type { ComponentProps } from "react"
import { CloudDownload as CloudDownloadImpl } from "./cloud-download"

export default {
  title: "Icon/Cloud Download",
  component: CloudDownloadImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const CloudDownload = (args: ComponentProps<typeof CloudDownloadImpl>) => <CloudDownloadImpl {...args} />
