import type { ComponentProps } from "react"
import { List as ListImpl } from "./list"

export default { title: "Icon/List", component: ListImpl }

export const List = (args: ComponentProps<typeof ListImpl>) => <ListImpl {...args} />
