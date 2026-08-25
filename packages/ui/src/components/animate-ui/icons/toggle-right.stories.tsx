import type { ComponentProps } from "react"
import { ToggleRight as ToggleRightImpl } from "./toggle-right"

export default {
  title: "Icon/Toggle Right",
  component: ToggleRightImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const ToggleRight = (args: ComponentProps<typeof ToggleRightImpl>) => <ToggleRightImpl {...args} />
