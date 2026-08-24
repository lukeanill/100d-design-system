import type { ComponentProps } from "react"
import { Collapsible as CollapsibleImpl } from "./collapsible"

export default { title: "Animation/Collapsible Base", component: CollapsibleImpl }

export const CollapsibleBase = (args: ComponentProps<typeof CollapsibleImpl>) => <CollapsibleImpl {...args} />
