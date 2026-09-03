import { NotificationList as NotificationListImpl } from "./notification-list"

export default {
  title: "Components/Content/Notification List",
  component: NotificationListImpl,
  parameters: { controls: { disable: true } },
}

export const NotificationList = () => <NotificationListImpl />
