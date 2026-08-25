import type { ComponentProps } from "react"
import { Badge as BadgeImpl } from "./badge"

export default {
  title: "Components/Badge",
  component: BadgeImpl,
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "destructive", "outline", "ghost", "link"],
    },
  },
  args: { variant: "default", children: "Badge" },
}

export const Badge = (args: ComponentProps<typeof BadgeImpl>) => <BadgeImpl {...args} />
