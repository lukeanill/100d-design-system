import type { ComponentProps } from "react"
import { LogOut as LogOutImpl } from "./log-out"

export default { title: "Icon/Log Out", component: LogOutImpl }

export const LogOut = (args: ComponentProps<typeof LogOutImpl>) => <LogOutImpl {...args} />
