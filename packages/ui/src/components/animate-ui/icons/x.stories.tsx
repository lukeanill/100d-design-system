import type { ComponentProps } from "react"
import { X as XImpl } from "./x"

export default {
  title: "Icon/X",
  component: XImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const X = (args: ComponentProps<typeof XImpl>) => <XImpl {...args} />
