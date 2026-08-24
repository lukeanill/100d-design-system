import type { ComponentProps } from "react"
import { NotificationList as NotificationListImpl } from "./notification-list"

export default { title: "Components/Notification List", component: NotificationListImpl }

export const NotificationList = (args: ComponentProps<typeof NotificationListImpl>) => <NotificationListImpl {...args} />
