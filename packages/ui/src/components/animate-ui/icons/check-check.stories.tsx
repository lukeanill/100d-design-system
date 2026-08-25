import type { ComponentProps } from "react"
import { CheckCheck as CheckCheckImpl } from "./check-check"

export default {
  title: "Icon/Check Check",
  component: CheckCheckImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const CheckCheck = (args: ComponentProps<typeof CheckCheckImpl>) => <CheckCheckImpl {...args} />
