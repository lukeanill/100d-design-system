import type { ComponentProps } from "react"
import { LockKeyhole as LockKeyholeImpl } from "./lock-keyhole"

export default {
  title: "Icon/Lock Keyhole",
  component: LockKeyholeImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const LockKeyhole = (args: ComponentProps<typeof LockKeyholeImpl>) => <LockKeyholeImpl {...args} />
