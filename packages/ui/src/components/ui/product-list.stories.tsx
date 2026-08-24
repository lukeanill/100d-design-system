import type { ComponentProps } from "react"
import { ProductList as ProductListImpl } from "./product-list"

export default { title: "Components/Product List", component: ProductListImpl }

export const ProductList = (args: ComponentProps<typeof ProductListImpl>) => <ProductListImpl {...args} />
