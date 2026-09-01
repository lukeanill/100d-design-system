import type { ComponentProps } from "react"
import { NativeSelect as NativeSelectImpl } from "./native-select"

export default {
  title: "Components/Selects/Native Select",
  component: NativeSelectImpl,
  argTypes: {
    size: {
      control: "select",
      options: ["default", "sm"],
    },
  },
  args: { size: "default", defaultValue: "banana" },
}

export const NativeSelect = (args: ComponentProps<typeof NativeSelectImpl>) => (
  <NativeSelectImpl {...args}>
    <option value="apple">Apple</option>
    <option value="banana">Banana</option>
    <option value="cherry">Cherry</option>
  </NativeSelectImpl>
)
