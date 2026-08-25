import type { ComponentProps } from "react"
import { MoveDown as MoveDownImpl } from "./move-down"

export default {
  title: "Icon/Move Down",
  component: MoveDownImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const MoveDown = (args: ComponentProps<typeof MoveDownImpl>) => <MoveDownImpl {...args} />
