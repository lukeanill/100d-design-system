import type { ComponentProps } from "react"
import { ToggleGroup as ToggleGroupImpl, Toggle } from "./toggle-group"

export default { title: "Components/Toggle Group", component: ToggleGroupImpl, args: { defaultValue: ["bold"] } }

export const ToggleGroup = (args: ComponentProps<typeof ToggleGroupImpl>) => (
  <ToggleGroupImpl {...args}>
    <Toggle value="bold">Bold</Toggle>
    <Toggle value="italic">Italic</Toggle>
    <Toggle value="underline">Underline</Toggle>
  </ToggleGroupImpl>
)
