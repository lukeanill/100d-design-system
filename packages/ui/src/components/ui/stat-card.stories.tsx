import type { ComponentProps } from "react"
import { StatCard as StatCardImpl, StatCardList } from "./stat-card"

export default {
  title: "Components/Content/Stat Card",
  component: StatCardImpl,
  argTypes: {
    "data.stats": { table: { disable: true } },
  },
  args: {
    data: {
      stats: [
        { change: 12.5, changeLabel: "vs last month", label: "Revenue", trend: "up", value: "$48,231" },
        { change: 3.2, changeLabel: "vs last month", label: "Orders", trend: "down", value: "1,204" },
        { change: 8.1, changeLabel: "vs last month", label: "Customers", trend: "up", value: "892" },
      ],
    },
  },
}

export const StatCard = (args: ComponentProps<typeof StatCardImpl>) => (
  <StatCardImpl {...args}>
    <StatCardList />
  </StatCardImpl>
)
