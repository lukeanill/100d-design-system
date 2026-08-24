import type { ComponentProps } from "react"
import { AvatarGroup as AvatarGroupImpl } from "./avatar-group"

export default { title: "Animation/Avatar Group Animate", component: AvatarGroupImpl }

export const AvatarGroupAnimate = (args: ComponentProps<typeof AvatarGroupImpl>) => <AvatarGroupImpl {...args} />
