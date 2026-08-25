import type { ComponentProps } from "react"
import { Axe as AxeImpl } from "./axe"

export default {
  title: "Icon/Axe",
  component: AxeImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Axe = (args: ComponentProps<typeof AxeImpl>) => <AxeImpl {...args} />
