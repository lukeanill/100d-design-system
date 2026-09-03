import type { ComponentProps } from "react"
import { ShareButton as ShareButtonImpl } from "./share-button"

export default {
  title: "Components/Actions/Share Button",
  component: ShareButtonImpl,
  argTypes: {
    size: { control: "select", options: ["default", "sm", "md", "lg"] },
    icon: { control: "select", options: ["suffix", "prefix"] },
    onIconClick: { table: { disable: true } },
  },
  args: { size: "default", icon: "suffix", children: "Share" },
}

export const ShareButton = (args: ComponentProps<typeof ShareButtonImpl>) => <ShareButtonImpl {...args} />
