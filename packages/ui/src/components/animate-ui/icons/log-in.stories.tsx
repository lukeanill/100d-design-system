import type { ComponentProps } from "react"
import { LogIn as LogInImpl } from "./log-in"

export default { title: "Icon/Log In", component: LogInImpl }

export const LogIn = (args: ComponentProps<typeof LogInImpl>) => <LogInImpl {...args} />
