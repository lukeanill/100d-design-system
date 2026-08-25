import type { ComponentProps } from "react"
import { MoveUp as MoveUpImpl } from "./move-up"

export default {
  title: "Icon/Move Up",
  component: MoveUpImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const MoveUp = (args: ComponentProps<typeof MoveUpImpl>) => <MoveUpImpl {...args} />
