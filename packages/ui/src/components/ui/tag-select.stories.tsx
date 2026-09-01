import type { ComponentProps } from "react"
import { TagSelect as TagSelectImpl, TagSelectContent, TagSelectTags, TagSelectActions } from "./tag-select"

export default {
  title: "Components/Selects/Tag Select",
  component: TagSelectImpl,
  argTypes: {
    "appearance.mode": {
      control: "select",
      options: ["single", "multiple"],
    },
    "appearance.showClear": { control: "boolean" },
    "appearance.showValidate": { control: "boolean" },
    "appearance.validateLabel": { control: "text" },
    "data.tags": { table: { disable: true } },
    "control.selectedTagIds": { table: { disable: true } },
    actions: { table: { disable: true } },
  },
  args: {
    appearance: {
      mode: "multiple",
      showClear: true,
      showValidate: true,
      validateLabel: "Apply tags",
    },
    control: { selectedTagIds: ["2"] },
    data: {
      tags: [
        { color: "red", id: "1", label: "Important" },
        { color: "yellow", id: "2", label: "In Progress" },
        { color: "green", id: "3", label: "Done" },
      ],
    },
  },
}

export const TagSelect = (args: ComponentProps<typeof TagSelectImpl>) => (
  <TagSelectImpl {...args}>
    <TagSelectContent>
      <TagSelectTags />
      <TagSelectActions />
    </TagSelectContent>
  </TagSelectImpl>
)
