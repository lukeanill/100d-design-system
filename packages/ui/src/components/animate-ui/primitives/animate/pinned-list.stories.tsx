import type { ComponentProps } from "react"
import { PinnedList as PinnedListImpl } from "./pinned-list"

export default { title: "Animation/Pinned List (Animate)", component: PinnedListImpl }

export const PinnedList = (args: ComponentProps<typeof PinnedListImpl>) => <PinnedListImpl {...args} />
