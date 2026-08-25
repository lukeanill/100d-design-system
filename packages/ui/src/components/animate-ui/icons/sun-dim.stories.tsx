import type { ComponentProps } from "react"
import { SunDim as SunDimImpl } from "./sun-dim"

export default {
  title: "Icon/Sun Dim",
  component: SunDimImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const SunDim = (args: ComponentProps<typeof SunDimImpl>) => <SunDimImpl {...args} />
