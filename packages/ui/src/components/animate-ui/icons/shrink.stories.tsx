import type { ComponentProps } from "react"
import { Shrink as ShrinkImpl } from "./shrink"

export default {
  title: "Icon/Shrink",
  component: ShrinkImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Shrink = (args: ComponentProps<typeof ShrinkImpl>) => <ShrinkImpl {...args} />
