import type { ComponentProps } from "react"
import { ToggleLeft as ToggleLeftImpl } from "./toggle-left"

export default {
  title: "Icon/Toggle Left",
  component: ToggleLeftImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const ToggleLeft = (args: ComponentProps<typeof ToggleLeftImpl>) => <ToggleLeftImpl {...args} />
