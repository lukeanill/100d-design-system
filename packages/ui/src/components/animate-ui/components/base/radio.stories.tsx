import type { ComponentProps } from "react"
import { Radio as RadioImpl, RadioGroup } from "./radio"

export default {
  title: "Components/Selects/Radio",
  component: RadioImpl,
  argTypes: {
    disabled: { control: "boolean" },
  },
  args: { disabled: false },
}

export const Radio = (args: ComponentProps<typeof RadioImpl>) => (
  <RadioGroup defaultValue="a">
    <RadioImpl {...args} value="a" />
    <RadioImpl {...args} value="b" />
    <RadioImpl {...args} value="c" />
    <RadioImpl {...args} value="d" disabled />
  </RadioGroup>
)
