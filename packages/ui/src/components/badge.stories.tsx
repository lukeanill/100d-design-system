import type { ComponentProps } from "react"
import { Badge as BadgeImpl } from "./badge"

export default { title: "Components/Badge", component: BadgeImpl }

export const Badge = (args: ComponentProps<typeof BadgeImpl>) => <BadgeImpl {...args} />
