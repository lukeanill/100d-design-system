import type { ComponentProps } from "react"
import {
  Breadcrumb as BreadcrumbImpl,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb"

export default { title: "Components/Navigation/Breadcrumb", component: BreadcrumbImpl }

export const Breadcrumb = (args: ComponentProps<typeof BreadcrumbImpl>) => (
  <BreadcrumbImpl {...args}>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink href="#">Home</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink href="#">Components</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </BreadcrumbImpl>
)
