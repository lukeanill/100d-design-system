import type { ComponentProps } from "react"
import { ContextMenu as ContextMenuImpl } from "./context-menu"

export default { title: "Components/Context Menu", component: ContextMenuImpl }

export const ContextMenu = (args: ComponentProps<typeof ContextMenuImpl>) => <ContextMenuImpl {...args} />
