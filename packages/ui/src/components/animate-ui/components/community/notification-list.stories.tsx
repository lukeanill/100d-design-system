import type { ComponentProps } from "react"
import { NotificationList as NotificationListImpl, notifications } from "./notification-list"

export default {
  title: "Components/Content/Notification List",
  component: NotificationListImpl,
  argTypes: {
    items: { control: "object" },
    label: { control: "text" },
    viewAllLabel: { control: "text" },
  },
  args: { items: notifications, label: "Notifications", viewAllLabel: "View all" },
}

export const NotificationList = (args: ComponentProps<typeof NotificationListImpl>) => <NotificationListImpl {...args} />
