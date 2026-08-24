import type { ComponentProps } from "react"
import { Table as TableImpl } from "./table"

export default { title: "Components/Table", component: TableImpl }

export const Table = (args: ComponentProps<typeof TableImpl>) => <TableImpl {...args} />
