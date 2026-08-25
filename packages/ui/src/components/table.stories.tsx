import type { ComponentProps } from "react"
import { Table as TableImpl, TableHeader, TableBody, TableRow, TableHead, TableCell } from "./table"

export default { title: "Components/Table", component: TableImpl }

export const Table = (args: ComponentProps<typeof TableImpl>) => (
  <TableImpl {...args}>
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Status</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>Invoice 001</TableCell>
        <TableCell>Paid</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Invoice 002</TableCell>
        <TableCell>Pending</TableCell>
      </TableRow>
    </TableBody>
  </TableImpl>
)
