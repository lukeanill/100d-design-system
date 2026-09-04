import type { ComponentProps } from "react"
import { Mail, Bell } from "lucide-react"
import { CalendarDays } from "lucide-react"
import { DiscreteTabs as DiscreteTabsImpl } from "./discrete-tabs"

export default {
  title: "Components/Navigation/Discrete Tabs",
  component: DiscreteTabsImpl,
  argTypes: {
    defaultTab: { control: "select", options: ["mail", "planner", "alerts"] },
    tabs: { table: { disable: true } },
    onTabChange: { table: { disable: true } },
  },
  args: {
    defaultTab: "planner",
  },
}

const tabs = [
  { icon: <Mail size={16} />, id: "mail", label: "Mail" },
  { icon: <CalendarDays size={16} />, id: "planner", label: "Planner" },
  { icon: <Bell size={16} />, id: "alerts", label: "Alerts" },
]

export const DiscreteTabs = (args: ComponentProps<typeof DiscreteTabsImpl>) => <DiscreteTabsImpl {...args} tabs={tabs} />
