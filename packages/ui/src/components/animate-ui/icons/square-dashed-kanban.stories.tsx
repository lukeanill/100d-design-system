import type { ComponentProps } from "react"
import { SquareDashedKanban as SquareDashedKanbanImpl } from "./square-dashed-kanban"

export default { title: "Icon/Square Dashed Kanban", component: SquareDashedKanbanImpl }

export const SquareDashedKanban = (args: ComponentProps<typeof SquareDashedKanbanImpl>) => <SquareDashedKanbanImpl {...args} />
