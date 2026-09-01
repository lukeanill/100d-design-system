import type { ComponentProps } from "react"
import { Select as SelectImpl, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./select"

export default {
  title: "Components/Selects/Select",
  component: SelectImpl,
  args: { defaultValue: "apple" },
}

export const Select = (args: ComponentProps<typeof SelectImpl>) => (
  <SelectImpl {...args}>
    <SelectTrigger className="w-48">
      <SelectValue placeholder="Select a fruit" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="apple">Apple</SelectItem>
      <SelectItem value="banana">Banana</SelectItem>
      <SelectItem value="cherry">Cherry</SelectItem>
    </SelectContent>
  </SelectImpl>
)
