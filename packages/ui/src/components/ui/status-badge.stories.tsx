import type { ComponentProps } from "react"
import { StatusBadge as StatusBadgeImpl } from "./status-badge"

export default { title: "Components/Status Badge", component: StatusBadgeImpl }

export const StatusBadge = (args: ComponentProps<typeof StatusBadgeImpl>) => <StatusBadgeImpl {...args} />
