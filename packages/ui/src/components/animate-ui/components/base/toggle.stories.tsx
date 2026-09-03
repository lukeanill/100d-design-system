import type { ComponentProps } from "react"
import { Toggle as ToggleImpl } from "./toggle"

export default {
  title: "Components/Actions/Toggle",
  component: ToggleImpl,
  argTypes: {
    variant: { control: "select", options: ["default", "outline"] },
    size: { control: "select", options: ["default", "sm", "lg", "icon"] },
    defaultPressed: { control: "boolean" },
    disabled: { control: "boolean" },
    pressed: { table: { disable: true } },
    onPressedChange: { table: { disable: true } },
  },
  args: {
    variant: "outline",
    size: "default",
    children: "Toggle",
    defaultPressed: false,
    disabled: false,
  },
}

export const Toggle = (args: ComponentProps<typeof ToggleImpl>) => <ToggleImpl {...args} />
