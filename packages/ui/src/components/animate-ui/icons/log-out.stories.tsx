import type { ComponentProps } from "react"
import { LogOut as LogOutImpl } from "./log-out"

export default {
  title: "Icon/Log Out",
  component: LogOutImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const LogOut = (args: ComponentProps<typeof LogOutImpl>) => <LogOutImpl {...args} />
