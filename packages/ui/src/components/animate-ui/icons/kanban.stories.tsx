import type { ComponentProps } from "react"
import { Kanban as KanbanImpl } from "./kanban"

export default {
  title: "Icon/Kanban",
  component: KanbanImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Kanban = (args: ComponentProps<typeof KanbanImpl>) => <KanbanImpl {...args} />
