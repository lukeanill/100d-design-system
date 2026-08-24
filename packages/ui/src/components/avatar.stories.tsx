import type { ComponentProps } from "react"
import { Avatar as AvatarImpl } from "./avatar"

export default { title: "Components/Avatar", component: AvatarImpl }

export const Avatar = (args: ComponentProps<typeof AvatarImpl>) => <AvatarImpl {...args} />
