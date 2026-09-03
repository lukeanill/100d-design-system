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
    copied: { control: "boolean" },
    delay: { control: { type: "number", min: 500, max: 8000, step: 500 } },
    onCopiedChange: { table: { disable: true } },
  },
  args: {
    variant: "default",
    size: "default",
    content: "npm install @workspace/ui",
    copied: false,
    delay: 3000,
  },
}

export const Copy = (args: ComponentProps<typeof CopyButtonImpl>) => <CopyButtonImpl {...args} />
