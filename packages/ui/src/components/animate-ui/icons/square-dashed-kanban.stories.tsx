import type { ComponentProps } from "react"
import { SquareDashedKanban as SquareDashedKanbanImpl } from "./square-dashed-kanban"

export default {
  title: "Icon/Square Dashed Kanban",
  component: SquareDashedKanbanImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const SquareDashedKanban = (args: ComponentProps<typeof SquareDashedKanbanImpl>) => <SquareDashedKanbanImpl {...args} />
