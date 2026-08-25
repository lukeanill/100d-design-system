import type { ComponentProps } from "react"
import { Lock as LockImpl } from "./lock"

export default {
  title: "Icon/Lock",
  component: LockImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Lock = (args: ComponentProps<typeof LockImpl>) => <LockImpl {...args} />
