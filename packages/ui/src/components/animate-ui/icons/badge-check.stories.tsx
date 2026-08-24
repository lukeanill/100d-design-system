import type { ComponentProps } from "react"
import { BadgeCheck as BadgeCheckImpl } from "./badge-check"

export default { title: "Icon/Badge Check", component: BadgeCheckImpl }

export const BadgeCheck = (args: ComponentProps<typeof BadgeCheckImpl>) => <BadgeCheckImpl {...args} />
