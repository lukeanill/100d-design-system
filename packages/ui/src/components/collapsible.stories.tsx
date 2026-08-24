import type { ComponentProps } from "react"
import { Collapsible as CollapsibleImpl } from "./collapsible"

export default { title: "Components/Collapsible", component: CollapsibleImpl }

export const Collapsible = (args: ComponentProps<typeof CollapsibleImpl>) => <CollapsibleImpl {...args} />
