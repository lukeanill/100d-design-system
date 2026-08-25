import type { ComponentProps } from "react"
import { Check as CheckImpl } from "./check"

export default {
  title: "Icon/Check",
  component: CheckImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Check = (args: ComponentProps<typeof CheckImpl>) => <CheckImpl {...args} />
