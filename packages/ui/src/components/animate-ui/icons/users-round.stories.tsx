import type { ComponentProps } from "react"
import { UsersRound as UsersRoundImpl } from "./users-round"

export default {
  title: "Icon/Users Round",
  component: UsersRoundImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const UsersRound = (args: ComponentProps<typeof UsersRoundImpl>) => <UsersRoundImpl {...args} />
