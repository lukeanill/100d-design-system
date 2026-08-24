import type { ComponentProps } from "react"
import { UsersRound as UsersRoundImpl } from "./users-round"

export default { title: "Icon/Users Round", component: UsersRoundImpl }

export const UsersRound = (args: ComponentProps<typeof UsersRoundImpl>) => <UsersRoundImpl {...args} />
