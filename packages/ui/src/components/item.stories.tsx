import type { ComponentProps } from "react"
import { Item as ItemImpl } from "./item"

export default { title: "Components/Item", component: ItemImpl }

export const Item = (args: ComponentProps<typeof ItemImpl>) => <ItemImpl {...args} />
