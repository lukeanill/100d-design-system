import type { ComponentProps } from "react"
import { User as UserImpl } from "./user"

export default {
  title: "Icon/User",
  component: UserImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const User = (args: ComponentProps<typeof UserImpl>) => <UserImpl {...args} />
