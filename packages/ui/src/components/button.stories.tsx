import type { ComponentProps } from "react"
import { Button as ButtonImpl } from "./button"

export default {
  title: "Components/Button",
  component: ButtonImpl,
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline", "secondary", "ghost", "destructive", "link"],
    },
    size: {
      control: "select",
      options: ["default", "xs", "sm", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"],
    },
  },
  args: { variant: "default", size: "default", children: "Button" },
}

export const Button = (args: ComponentProps<typeof ButtonImpl>) => <ButtonImpl {...args} />
