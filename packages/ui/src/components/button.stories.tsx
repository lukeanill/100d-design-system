import type { ComponentProps } from "react"
import { Button as ButtonImpl } from "./button"

export default {
  title: "Components/Actions/Button",
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
    disabled: { control: "boolean" },
    tapScale: { control: { type: "number", min: 0.8, max: 1, step: 0.01 } },
    onClick: { table: { disable: true } },
  },
  args: { variant: "default", size: "default", children: "Button", disabled: false, tapScale: 0.95 },
}

export const Button = (args: ComponentProps<typeof ButtonImpl>) => <ButtonImpl {...args} />
