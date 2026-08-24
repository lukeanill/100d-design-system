import type { ComponentProps } from "react"
import { User as UserImpl } from "./user"

export default { title: "Icon/User", component: UserImpl }

export const User = (args: ComponentProps<typeof UserImpl>) => <UserImpl {...args} />
