import type { ComponentProps } from "react"
import { IconButton as IconButtonImpl } from "./icon"

export default {
  title: "Components/Actions/Icon",
  component: IconButtonImpl,
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "accent", "destructive", "outline", "secondary", "ghost", "link"],
    },
    size: { control: "select", options: ["default", "xs", "sm", "lg"] },
  },
  args: { variant: "default", size: "default" },
}

export const Icon = (args: ComponentProps<typeof IconButtonImpl>) => (
  <IconButtonImpl {...args}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  </IconButtonImpl>
)
