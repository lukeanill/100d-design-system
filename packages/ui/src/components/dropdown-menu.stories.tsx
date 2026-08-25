import type { ComponentProps } from "react"
import {
  DropdownMenu as DropdownMenuImpl,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "./dropdown-menu"
import { Button } from "@workspace/ui/components/button"

export default { title: "Components/Dropdown Menu", component: DropdownMenuImpl }

export const DropdownMenu = (args: ComponentProps<typeof DropdownMenuImpl>) => (
  <DropdownMenuImpl {...args}>
    <DropdownMenuTrigger render={<Button variant="outline">Open menu</Button>} />
    <DropdownMenuContent>
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem>Profile</DropdownMenuItem>
      <DropdownMenuItem>Settings</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenuImpl>
)
