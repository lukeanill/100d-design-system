import type { ComponentProps } from "react"
import { Table as TableImpl } from "./table"

export default { title: "Components/Data Table", component: TableImpl }

export const DataTable = (args: ComponentProps<typeof TableImpl>) => <TableImpl {...args} />
