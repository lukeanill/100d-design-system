import type { ComponentProps } from "react"
import { LogIn as LogInImpl } from "./log-in"

export default {
  title: "Icon/Log In",
  component: LogInImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const LogIn = (args: ComponentProps<typeof LogInImpl>) => <LogInImpl {...args} />
