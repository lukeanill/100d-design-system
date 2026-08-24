import type { ComponentProps } from "react"
import { Sidebar as SidebarImpl } from "./sidebar"

export default { title: "Components/Sidebar", component: SidebarImpl }

export const Sidebar = (args: ComponentProps<typeof SidebarImpl>) => <SidebarImpl {...args} />
