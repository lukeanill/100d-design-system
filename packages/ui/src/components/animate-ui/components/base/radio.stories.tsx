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
    <RadioImpl {...args} value="a" aria-label="Option A" />
    <RadioImpl {...args} value="b" aria-label="Option B" />
    <RadioImpl {...args} value="c" aria-label="Option C" />
    <RadioImpl {...args} value="d" aria-label="Option D" disabled />
  </RadioGroup>
)
