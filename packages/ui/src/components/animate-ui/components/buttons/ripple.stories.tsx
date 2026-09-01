import type { ComponentProps } from "react"
import { RippleButton as RippleButtonImpl } from "./ripple"

export default {
  title: "Components/Animate UI/Ripple",
  tags: ["!dev"],
  component: RippleButtonImpl,
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "accent", "destructive", "outline", "secondary", "ghost", "link"],
    },
  },
  args: { variant: "default", children: "Click me" },
}

export const Ripple = (args: ComponentProps<typeof RippleButtonImpl>) => <RippleButtonImpl {...args} />
