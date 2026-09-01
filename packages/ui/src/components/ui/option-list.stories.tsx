import type { ComponentProps } from "react"
import { OptionList as OptionListImpl, OptionListContent, OptionListOptions, OptionListActions } from "./option-list"

export default {
  title: "Components/Actions/Option List",
  component: OptionListImpl,
  argTypes: {
    "appearance.multiple": { control: "boolean" },
    "control.selectedOptionIndex": { control: "number" },
    "data.options": { table: { disable: true } },
    actions: { table: { disable: true } },
  },
  args: {
    appearance: { multiple: false },
    control: { selectedOptionIndex: 0 },
    data: {
      options: [
        { description: "3-5 business days", label: "Standard shipping" },
        { description: "1-2 business days", label: "Express shipping" },
        { description: "Available in 2h", label: "Store pickup" },
      ],
    },
  },
}

export const OptionList = (args: ComponentProps<typeof OptionListImpl>) => (
  <OptionListImpl {...args}>
    <OptionListContent>
      <OptionListOptions />
      <OptionListActions />
    </OptionListContent>
  </OptionListImpl>
)
