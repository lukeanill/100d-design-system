import type { ComponentProps } from "react"
import {
  InputGroup as InputGroupImpl,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "./input-group"

export default {
  title: "Components/Inputs/Input Group",
  component: InputGroupImpl,
  parameters: { controls: { disable: true } },
}

export const InputGroup = (args: ComponentProps<typeof InputGroupImpl>) => (
  <InputGroupImpl {...args}>
    <InputGroupAddon>
      <InputGroupText>@</InputGroupText>
    </InputGroupAddon>
    <InputGroupInput placeholder="username" />
  </InputGroupImpl>
)
