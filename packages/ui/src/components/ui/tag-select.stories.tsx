import type { ComponentProps } from "react"
import { TagSelect as TagSelectImpl, TagSelectContent, TagSelectTags, TagSelectActions } from "./tag-select"

export default { title: "Components/Tag Select", component: TagSelectImpl }

export const TagSelect = (args: ComponentProps<typeof TagSelectImpl>) => (
  <TagSelectImpl {...args}>
    <TagSelectContent>
      <TagSelectTags />
      <TagSelectActions />
    </TagSelectContent>
  </TagSelectImpl>
)
