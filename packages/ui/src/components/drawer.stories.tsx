import type { ComponentProps } from "react"
import { Drawer as DrawerImpl } from "./drawer"

export default { title: "Components/Drawer", component: DrawerImpl }

export const Drawer = (args: ComponentProps<typeof DrawerImpl>) => <DrawerImpl {...args} />
