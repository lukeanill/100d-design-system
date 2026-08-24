import type { ComponentProps } from "react"
import { NavigationMenu as NavigationMenuImpl } from "./navigation-menu"

export default { title: "Components/Navigation Menu", component: NavigationMenuImpl }

export const NavigationMenu = (args: ComponentProps<typeof NavigationMenuImpl>) => <NavigationMenuImpl {...args} />
