import type { ComponentProps } from "react"
import { CopyButton as CopyButtonImpl } from "./copy"

export default {
  title: "Components/Actions/Copy",
  component: CopyButtonImpl,
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "accent", "destructive", "outline", "secondary", "ghost", "link"],
    },
    size: { control: "select", options: ["default", "xs", "sm", "lg"] },
  },
  args: { variant: "default", size: "default", content: "npm install @workspace/ui" },
}

export const Copy = (args: ComponentProps<typeof CopyButtonImpl>) => <CopyButtonImpl {...args} />
