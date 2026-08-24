import type { ComponentProps } from "react"
import { TagSelect as TagSelectImpl } from "./tag-select"

export default { title: "Components/Tag Select", component: TagSelectImpl }

export const TagSelect = (args: ComponentProps<typeof TagSelectImpl>) => <TagSelectImpl {...args} />
