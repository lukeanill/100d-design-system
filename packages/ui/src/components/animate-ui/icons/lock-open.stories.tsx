import type { ComponentProps } from "react"
import { LockOpen as LockOpenImpl } from "./lock-open"

export default {
  title: "Icon/Lock Open",
  component: LockOpenImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const LockOpen = (args: ComponentProps<typeof LockOpenImpl>) => <LockOpenImpl {...args} />
