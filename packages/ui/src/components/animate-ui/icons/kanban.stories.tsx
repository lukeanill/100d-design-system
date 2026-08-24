import type { ComponentProps } from "react"
import { Kanban as KanbanImpl } from "./kanban"

export default { title: "Icon/Kanban", component: KanbanImpl }

export const Kanban = (args: ComponentProps<typeof KanbanImpl>) => <KanbanImpl {...args} />
