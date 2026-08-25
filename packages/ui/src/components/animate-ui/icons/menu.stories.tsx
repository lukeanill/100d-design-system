import type { ComponentProps } from "react"
import { Menu as MenuImpl } from "./menu"

export default {
  title: "Icon/Menu",
  component: MenuImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Menu = (args: ComponentProps<typeof MenuImpl>) => <MenuImpl {...args} />
