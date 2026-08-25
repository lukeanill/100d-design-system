import type { ComponentProps } from "react"
import {
  InputGroup as InputGroupImpl,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "./input-group"

export default { title: "Components/Input Group", component: InputGroupImpl }

export const InputGroup = (args: ComponentProps<typeof InputGroupImpl>) => (
  <InputGroupImpl {...args}>
    <InputGroupAddon>
      <InputGroupText>@</InputGroupText>
    </InputGroupAddon>
    <InputGroupInput placeholder="username" />
  </InputGroupImpl>
)
