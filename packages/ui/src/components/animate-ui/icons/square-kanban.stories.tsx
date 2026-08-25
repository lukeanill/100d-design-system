import type { ComponentProps } from "react"
import { SquareKanban as SquareKanbanImpl } from "./square-kanban"

export default {
  title: "Icon/Square Kanban",
  component: SquareKanbanImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const SquareKanban = (args: ComponentProps<typeof SquareKanbanImpl>) => <SquareKanbanImpl {...args} />
