import type { ComponentProps } from "react"
import {
  NavigationMenu as NavigationMenuImpl,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "./navigation-menu"

export default {
  title: "Components/Navigation/Navigation Menu",
  component: NavigationMenuImpl,
  argTypes: {
    align: {
      control: "select",
      options: ["start", "center", "end"],
    },
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
    children: { table: { disable: true } },
  },
  args: { align: "start", orientation: "horizontal" },
}

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
