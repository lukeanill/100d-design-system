import type { ComponentProps } from "react"
import { Table as TableImpl, TableContent, TableHeader, TableGrid, TableFooter } from "./table"

export default { title: "Components/Data Table", component: TableImpl }

export const DataTable = (args: ComponentProps<typeof TableImpl>) => (
  <TableImpl {...args}>
    <TableContent>
      <TableHeader />
      <TableGrid />
      <TableFooter />
    </TableContent>
  </TableImpl>
)
