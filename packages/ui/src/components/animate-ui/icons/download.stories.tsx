import type { ComponentProps } from "react"
import { Download as DownloadImpl } from "./download"

export default {
  title: "Icon/Download",
  component: DownloadImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Download = (args: ComponentProps<typeof DownloadImpl>) => <DownloadImpl {...args} />
