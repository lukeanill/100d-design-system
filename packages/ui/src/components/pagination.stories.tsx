import type { ComponentProps } from "react"
import { Pagination as PaginationImpl } from "./pagination"

export default { title: "Components/Pagination", component: PaginationImpl }

export const Pagination = (args: ComponentProps<typeof PaginationImpl>) => <PaginationImpl {...args} />
