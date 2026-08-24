import type { ComponentProps } from "react"
import { SquareKanban as SquareKanbanImpl } from "./square-kanban"

export default { title: "Icon/Square Kanban", component: SquareKanbanImpl }

export const SquareKanban = (args: ComponentProps<typeof SquareKanbanImpl>) => <SquareKanbanImpl {...args} />
