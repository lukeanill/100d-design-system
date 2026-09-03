import type { ComponentProps } from "react"
import { SelectionActions as SelectionActionsImpl } from "./selection-actions"

export default {
  title: "Components/AI/Selection Actions",
  component: SelectionActionsImpl,
  argTypes: {
    "labels.keep": { control: "text" },
    "labels.discard": { control: "text" },
    "labels.placeholder": { control: "text" },
    "data.text": { table: { disable: true } },
    "data.actions": { table: { disable: true } },
    actions: { table: { disable: true } },
  },
  args: {
    labels: { discard: "Discard", keep: "Keep", placeholder: "Describe edits" },
  },
}

export const SelectionActions = (args: ComponentProps<typeof SelectionActionsImpl>) => <SelectionActionsImpl {...args} />
