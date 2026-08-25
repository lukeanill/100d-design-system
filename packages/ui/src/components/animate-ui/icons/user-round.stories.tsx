import type { ComponentProps } from "react"
import { UserRound as UserRoundImpl } from "./user-round"

export default {
  title: "Icon/User Round",
  component: UserRoundImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const UserRound = (args: ComponentProps<typeof UserRoundImpl>) => <UserRoundImpl {...args} />
