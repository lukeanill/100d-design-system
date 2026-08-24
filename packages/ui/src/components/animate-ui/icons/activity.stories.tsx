import type { ComponentProps } from "react"
import { Activity as ActivityImpl } from "./activity"

export default { title: "Icon/Activity", component: ActivityImpl }

export const Activity = (args: ComponentProps<typeof ActivityImpl>) => <ActivityImpl {...args} />
