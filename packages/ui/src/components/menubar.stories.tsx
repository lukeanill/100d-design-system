import type { ComponentProps } from "react"
import { Menubar as MenubarImpl } from "./menubar"

export default { title: "Components/Menubar", component: MenubarImpl }

export const Menubar = (args: ComponentProps<typeof MenubarImpl>) => <MenubarImpl {...args} />
