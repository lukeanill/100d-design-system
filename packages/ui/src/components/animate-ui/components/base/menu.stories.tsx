import type { ComponentProps } from "react"
import { Menu as MenuImpl } from "./menu"

export default { title: "Components/Menu", component: MenuImpl }

export const Menu = (args: ComponentProps<typeof MenuImpl>) => <MenuImpl {...args} />
