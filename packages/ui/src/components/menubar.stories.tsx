import type { ComponentProps } from "react"
import {
  Menubar as MenubarImpl,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
} from "./menubar"

export default {
  title: "Components/Navigation/Menubar",
  component: MenubarImpl,
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
    children: { table: { disable: true } },
  },
  args: { orientation: "horizontal" },
}

export const Menubar = (args: ComponentProps<typeof MenubarImpl>) => (
  <MenubarImpl {...args}>
    <MenubarMenu>
      <MenubarTrigger>File</MenubarTrigger>
      <MenubarContent>
        <MenubarItem>New Tab</MenubarItem>
        <MenubarItem>New Window</MenubarItem>
        <MenubarSeparator />
        <MenubarItem>Share</MenubarItem>
      </MenubarContent>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger>Edit</MenubarTrigger>
      <MenubarContent>
        <MenubarItem>Undo</MenubarItem>
        <MenubarItem>Redo</MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  </MenubarImpl>
)
