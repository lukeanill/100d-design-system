import type { ComponentProps } from "react"
import { EqualNot as EqualNotImpl } from "./equal-not"

export default {
  title: "Icon/Equal Not",
  component: EqualNotImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const EqualNot = (args: ComponentProps<typeof EqualNotImpl>) => <EqualNotImpl {...args} />
