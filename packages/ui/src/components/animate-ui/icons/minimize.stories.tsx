import type { ComponentProps } from "react"
import { Minimize as MinimizeImpl } from "./minimize"

export default {
  title: "Icon/Minimize",
  component: MinimizeImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Minimize = (args: ComponentProps<typeof MinimizeImpl>) => <MinimizeImpl {...args} />
