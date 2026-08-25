import type { ComponentProps } from "react"
import { BadgeCheck as BadgeCheckImpl } from "./badge-check"

export default {
  title: "Icon/Badge Check",
  component: BadgeCheckImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const BadgeCheck = (args: ComponentProps<typeof BadgeCheckImpl>) => <BadgeCheckImpl {...args} />
