import type { ComponentProps } from "react"
import {
  NavigationMenu as NavigationMenuImpl,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "./navigation-menu"

export default { title: "Components/Navigation Menu", component: NavigationMenuImpl }

export const NavigationMenu = (args: ComponentProps<typeof NavigationMenuImpl>) => (
  <NavigationMenuImpl {...args}>
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
        <NavigationMenuContent>
          <NavigationMenuLink href="#">Introduction</NavigationMenuLink>
          <NavigationMenuLink href="#">Installation</NavigationMenuLink>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenuImpl>
)
