import type { ComponentProps } from "react"
import { Users as UsersImpl } from "./users"

export default {
  title: "Icon/Users",
  component: UsersImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Users = (args: ComponentProps<typeof UsersImpl>) => <UsersImpl {...args} />
