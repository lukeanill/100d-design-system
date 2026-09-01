import type { ComponentProps } from "react"
import { Button as ButtonImpl } from "./button"

export default {
  title: "Components/Animate UI/Button Animated",
  tags: ["!dev"],
  component: ButtonImpl,
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "accent", "destructive", "outline", "secondary", "ghost", "link"],
    },
    size: { control: "select", options: ["default", "sm", "lg", "icon", "icon-sm", "icon-lg"] },
  },
  args: { variant: "default", size: "default", children: "Button" },
}

export const ButtonAnimated = (args: ComponentProps<typeof ButtonImpl>) => <ButtonImpl {...args} />
