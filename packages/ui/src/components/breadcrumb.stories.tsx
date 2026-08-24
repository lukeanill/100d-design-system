import type { ComponentProps } from "react"
import { Breadcrumb as BreadcrumbImpl } from "./breadcrumb"

export default { title: "Components/Breadcrumb", component: BreadcrumbImpl }

export const Breadcrumb = (args: ComponentProps<typeof BreadcrumbImpl>) => <BreadcrumbImpl {...args} />
