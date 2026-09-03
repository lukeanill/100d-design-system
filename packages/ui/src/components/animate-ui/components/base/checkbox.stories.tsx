import type { ComponentProps } from "react"
import { Checkbox as CheckboxImpl } from "./checkbox"

export default {
  title: "Components/Selects/Checkbox",
  component: CheckboxImpl,
  argTypes: {
    variant: { control: "select", options: ["default", "accent"] },
    size: { control: "select", options: ["default", "sm", "lg"] },
    disabled: { control: "boolean" },
    indeterminate: { control: "boolean" },
    defaultChecked: { control: "boolean" },
  },
  args: {
    variant: "default",
    size: "default",
    defaultChecked: true,
    disabled: false,
    indeterminate: false,
  },
}

export const Checkbox = (args: ComponentProps<typeof CheckboxImpl>) => <CheckboxImpl {...args} />
