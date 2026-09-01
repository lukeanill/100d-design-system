import type { ComponentProps } from "react"
import { StatusBadge as StatusBadgeImpl, StatusBadgeIcon, StatusBadgeLabel } from "./status-badge"

export default {
  title: "Components/Content/Status Badge",
  component: StatusBadgeImpl,
  argTypes: {
    "data.status": {
      control: "select",
      options: [
        "success",
        "pending",
        "processing",
        "warning",
        "error",
        "shipped",
        "delivered",
        "cancelled",
      ],
    },
    "appearance.size": {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    "appearance.label": { control: "text" },
  },
  args: {
    appearance: { size: "md" },
    data: { status: "shipped" },
  },
}

export const StatusBadge = (args: ComponentProps<typeof StatusBadgeImpl>) => (
  <StatusBadgeImpl {...args}>
    <StatusBadgeIcon />
    <StatusBadgeLabel />
  </StatusBadgeImpl>
)
