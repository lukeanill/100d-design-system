import type { ComponentProps } from "react"
import { DropdownMenu as DropdownMenuImpl } from "./dropdown-menu"

export default { title: "Components/Dropdown Menu", component: DropdownMenuImpl }

export const DropdownMenu = (args: ComponentProps<typeof DropdownMenuImpl>) => <DropdownMenuImpl {...args} />
