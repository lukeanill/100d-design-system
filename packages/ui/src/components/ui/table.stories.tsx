import type { ComponentProps } from "react"
import { Table as TableImpl, TableContent, TableHeader, TableGrid, TableFooter } from "./table"

export default {
  title: "Components/Content/Data Table",
  tags: ["!dev"],
  component: TableImpl,
  argTypes: {
    "appearance.compact": { control: "boolean" },
    "appearance.displayMode": {
      control: "select",
      options: ["inline", "pip", "fullscreen"],
    },
    "appearance.emptyMessage": { control: "text" },
    "appearance.maxRows": { control: "number" },
    "appearance.selectable": {
      control: "select",
      options: ["none", "single", "multi"],
    },
    "appearance.showActions": { control: "boolean" },
    "appearance.showFooter": { control: "boolean" },
    "appearance.showHeader": { control: "boolean" },
    "appearance.stickyHeader": { control: "boolean" },
    "control.loading": { control: "boolean" },
    "data.title": { control: "text" },
    "data.titleImage": { control: "text" },
    "data.totalRows": { control: "number" },
    "data.columns": { table: { disable: true } },
    "data.rows": { table: { disable: true } },
    "data.lastUpdated": { table: { disable: true } },
    "control.selectedRows": { table: { disable: true } },
    actions: { table: { disable: true } },
  },
  args: {
    appearance: {
      compact: false,
      displayMode: "inline",
      emptyMessage: "No data available",
      maxRows: 5,
      selectable: "single",
      showActions: true,
      showFooter: true,
      showHeader: true,
      stickyHeader: false,
    },
    control: { loading: false },
    data: {
      columns: [
        { accessor: "name", header: "Name", sortable: true },
        { accessor: "email", header: "Email", sortable: true },
        { accessor: "status", header: "Status", sortable: true },
      ],
      lastUpdated: "2026-08-29T15:32:00",
      rows: [
        { email: "sarah.chen@acmecorp.com", name: "Sarah Chen", status: "Active" },
        { email: "marcus.r@globalretail.com", name: "Marcus Rodriguez", status: "Active" },
        { email: "priya.patel@techstart.io", name: "Priya Patel", status: "Pending" },
        { email: "j.wilson@financeplus.com", name: "James Wilson", status: "Active" },
        { email: "aisha.j@healthcareplus.org", name: "Aisha Johnson", status: "Inactive" },
      ],
      title: "Customers",
      totalRows: 128,
    },
  },
}

export const DataTable = (args: ComponentProps<typeof TableImpl>) => (
  <TableImpl {...args}>
    <TableContent>
      <TableHeader />
      <TableGrid />
      <TableFooter />
    </TableContent>
  </TableImpl>
)
