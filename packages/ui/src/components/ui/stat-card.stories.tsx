import type { ComponentProps } from "react"
import { StatCard as StatCardImpl } from "./stat-card"

export default { title: "Components/Stat Card", component: StatCardImpl }

export const StatCard = (args: ComponentProps<typeof StatCardImpl>) => <StatCardImpl {...args} />
