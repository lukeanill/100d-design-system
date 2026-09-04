import type { ComponentProps } from "react"
import { Mail, Bell } from "lucide-react"
import { CalendarDays } from "lucide-react"
import { DiscreteTabs as DiscreteTabsImpl } from "./discrete-tabs"

export default {
  title: "Components/Navigation/Discrete Tabs",
  component: DiscreteTabsImpl,
  parameters: { controls: { disable: true } },
}

const tabs = [
  { icon: <Mail size={22} />, id: "mail", label: "Mail" },
  { icon: <CalendarDays size={22} />, id: "planner", label: "Planner" },
  { icon: <Bell size={22} />, id: "alerts", label: "Alerts" },
]

export const DiscreteTabs = (args: ComponentProps<typeof DiscreteTabsImpl>) => <DiscreteTabsImpl {...args} tabs={tabs} defaultTab="planner" />
