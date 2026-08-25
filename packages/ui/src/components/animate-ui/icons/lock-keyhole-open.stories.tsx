import type { ComponentProps } from "react"
import { LockKeyholeOpen as LockKeyholeOpenImpl } from "./lock-keyhole-open"

export default {
  title: "Icon/Lock Keyhole Open",
  component: LockKeyholeOpenImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const LockKeyholeOpen = (args: ComponentProps<typeof LockKeyholeOpenImpl>) => <LockKeyholeOpenImpl {...args} />
