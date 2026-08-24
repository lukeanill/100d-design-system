import type { ComponentProps } from "react"
import { Menu as MenuImpl } from "./menu"

export default { title: "Icon/Menu", component: MenuImpl }

export const Menu = (args: ComponentProps<typeof MenuImpl>) => <MenuImpl {...args} />
