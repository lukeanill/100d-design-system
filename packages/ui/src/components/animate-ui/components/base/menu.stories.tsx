import type { ComponentProps } from "react"
import { Menu as MenuImpl, MenuTrigger, MenuPortal, MenuPanel, MenuItem, MenuSeparator } from "./menu"
import { Button } from "@workspace/ui/components/button"

export default {
  title: "Components/Overlays/Menu",
  component: MenuImpl,
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
  },
  args: { defaultOpen: false, orientation: "vertical", modal: true },
}

export const Menu = (args: ComponentProps<typeof MenuImpl>) => (
  <MenuImpl {...args}>
    <MenuTrigger render={<Button variant="outline">Open menu</Button>} />
    <MenuPortal>
      <MenuPanel>
        <MenuItem>Profile</MenuItem>
        <MenuItem>Settings</MenuItem>
        <MenuSeparator />
        <MenuItem>Log out</MenuItem>
      </MenuPanel>
    </MenuPortal>
  </MenuImpl>
)
