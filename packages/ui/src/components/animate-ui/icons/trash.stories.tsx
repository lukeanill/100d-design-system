import type { ComponentProps } from "react"
import { Trash as TrashImpl } from "./trash"

export default {
  title: "Icon/Trash",
  component: TrashImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Trash = (args: ComponentProps<typeof TrashImpl>) => <TrashImpl {...args} />
