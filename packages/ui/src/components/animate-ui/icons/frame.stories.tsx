import type { ComponentProps } from "react"
import { Frame as FrameImpl } from "./frame"

export default {
  title: "Icon/Frame",
  component: FrameImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Frame = (args: ComponentProps<typeof FrameImpl>) => <FrameImpl {...args} />
