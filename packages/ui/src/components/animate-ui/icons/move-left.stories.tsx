import type { ComponentProps } from "react"
import { MoveLeft as MoveLeftImpl } from "./move-left"

export default {
  title: "Icon/Move Left",
  component: MoveLeftImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const MoveLeft = (args: ComponentProps<typeof MoveLeftImpl>) => <MoveLeftImpl {...args} />
