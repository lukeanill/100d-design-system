import type { ComponentProps } from "react"
import { Users as UsersImpl } from "./users"

export default { title: "Icon/Users", component: UsersImpl }

export const Users = (args: ComponentProps<typeof UsersImpl>) => <UsersImpl {...args} />
