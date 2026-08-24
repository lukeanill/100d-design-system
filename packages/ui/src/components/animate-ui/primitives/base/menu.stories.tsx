import type { ComponentProps } from "react"
import { Menu as MenuImpl } from "./menu"

export default { title: "Animation/Menu Base", component: MenuImpl }

export const MenuBase = (args: ComponentProps<typeof MenuImpl>) => <MenuImpl {...args} />
