import type { ComponentProps } from "react"
import { Activity as ActivityImpl } from "./activity"

export default {
  title: "Icon/Activity",
  component: ActivityImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Activity = (args: ComponentProps<typeof ActivityImpl>) => <ActivityImpl {...args} />
