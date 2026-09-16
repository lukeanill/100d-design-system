import type { ComponentProps } from "react"
import type { StoryContext } from "@storybook/react"
import { expect, fn, userEvent, within } from "storybook/test"
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
    onTabChange: fn(),
  },
}

const tabs = [
  { icon: <Mail size={16} />, id: "mail", label: "Mail" },
  { icon: <CalendarDays size={16} />, id: "planner", label: "Planner" },
  { icon: <Bell size={16} />, id: "alerts", label: "Alerts" },
]

export const DiscreteTabs = (args: ComponentProps<typeof DiscreteTabsImpl>) => <DiscreteTabsImpl {...args} tabs={tabs} />

DiscreteTabs.play = async ({ args, canvasElement }: StoryContext) => {
  const canvas = within(canvasElement)

  await userEvent.click(canvas.getByRole("button", { name: "Alerts" }))
  await expect(args.onTabChange).toHaveBeenCalledWith("alerts")
}
