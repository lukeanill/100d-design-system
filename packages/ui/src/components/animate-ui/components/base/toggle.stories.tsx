import type { ComponentProps } from "react"
import { Toggle as ToggleImpl } from "./toggle"

export default {
  title: "Components/Toggle",
  component: ToggleImpl,
  argTypes: {
    variant: { control: "select", options: ["default", "outline"] },
    size: { control: "select", options: ["default", "sm", "lg", "icon"] },
  },
  args: { variant: "outline", size: "default", children: "Toggle" },
}

export const Toggle = (args: ComponentProps<typeof ToggleImpl>) => <ToggleImpl {...args} />
