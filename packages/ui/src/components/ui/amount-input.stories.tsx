import type { ComponentProps } from "react"
import { AmountInput as AmountInputImpl, AmountInputDisplay } from "./amount-input"

export default {
  title: "Components/Inputs/Amount Input",
  component: AmountInputImpl,
  argTypes: {
    "appearance.currency": { control: "text" },
    "appearance.label": { control: "text" },
    "appearance.max": { control: "number" },
    "appearance.min": { control: "number" },
    "appearance.step": { control: "number" },
    "control.value": { control: "number" },
    actions: { table: { disable: true } },
    "data.presets": { table: { disable: true } },
  },
  args: {
    appearance: { currency: "USD", label: "Tip amount", max: 500, min: 0, step: 5 },
    control: { value: 20 },
    data: { presets: [5, 10, 20, 50] },
  },
}

export const AmountInput = (args: ComponentProps<typeof AmountInputImpl>) => (
  <AmountInputImpl {...args}>
    <AmountInputDisplay />
  </AmountInputImpl>
)
