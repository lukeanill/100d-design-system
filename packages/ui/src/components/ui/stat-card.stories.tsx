import type { ComponentProps } from "react"
import { StatCard as StatCardImpl, StatCardList } from "./stat-card"

export default { title: "Components/Stat Card", component: StatCardImpl }

export const StatCard = (args: ComponentProps<typeof StatCardImpl>) => (
  <StatCardImpl {...args}>
    <StatCardList />
  </StatCardImpl>
)
