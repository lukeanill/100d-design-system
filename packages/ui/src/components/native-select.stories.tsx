import type { ComponentProps } from "react"
import { NativeSelect as NativeSelectImpl } from "./native-select"

export default { title: "Components/Native Select", component: NativeSelectImpl }

export const NativeSelect = (args: ComponentProps<typeof NativeSelectImpl>) => (
  <NativeSelectImpl {...args}>
    <option value="apple">Apple</option>
    <option value="banana">Banana</option>
    <option value="cherry">Cherry</option>
  </NativeSelectImpl>
)
