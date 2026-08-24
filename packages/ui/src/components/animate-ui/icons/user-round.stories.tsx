import type { ComponentProps } from "react"
import { UserRound as UserRoundImpl } from "./user-round"

export default { title: "Icon/User Round", component: UserRoundImpl }

export const UserRound = (args: ComponentProps<typeof UserRoundImpl>) => <UserRoundImpl {...args} />
