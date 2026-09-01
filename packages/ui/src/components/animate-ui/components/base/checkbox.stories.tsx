import type { ComponentProps } from "react"
import { Checkbox as CheckboxImpl } from "./checkbox"

export default {
  title: "Components/Selects/Checkbox",
  component: CheckboxImpl,
  argTypes: {
    variant: { control: "select", options: ["default", "accent"] },
    size: { control: "select", options: ["default", "sm", "lg"] },
  },
  args: { variant: "default", size: "default", defaultChecked: true },
}

export const Checkbox = (args: ComponentProps<typeof CheckboxImpl>) => <CheckboxImpl {...args} />
