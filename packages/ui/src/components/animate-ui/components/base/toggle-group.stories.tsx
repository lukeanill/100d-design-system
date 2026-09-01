import type { ComponentProps } from "react"
import { ToggleGroup as ToggleGroupImpl, Toggle } from "./toggle-group"

export default {
  title: "Components/Actions/Toggle Group",
  component: ToggleGroupImpl,
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
  },
  args: { defaultValue: ["bold"], multiple: true, orientation: "horizontal" },
}

export const ToggleGroup = (args: ComponentProps<typeof ToggleGroupImpl>) => (
  <ToggleGroupImpl {...args}>
    <Toggle value="bold">Bold</Toggle>
    <Toggle value="italic">Italic</Toggle>
    <Toggle value="underline">Underline</Toggle>
  </ToggleGroupImpl>
)
