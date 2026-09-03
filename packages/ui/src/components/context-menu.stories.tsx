import type { ComponentProps } from "react"
import {
  ContextMenu as ContextMenuImpl,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "./context-menu"

export default {
  title: "Components/Overlays/Context Menu",
  component: ContextMenuImpl,
  parameters: { controls: { disable: true } },
}

export const ContextMenu = (args: ComponentProps<typeof ContextMenuImpl>) => (
  <ContextMenuImpl {...args}>
    <ContextMenuTrigger className="flex h-32 w-64 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
      Right click here
    </ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuItem>Back</ContextMenuItem>
      <ContextMenuItem>Forward</ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem>Reload</ContextMenuItem>
    </ContextMenuContent>
  </ContextMenuImpl>
)
