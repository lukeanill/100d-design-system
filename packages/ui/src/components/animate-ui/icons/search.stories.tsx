import type { ComponentProps } from "react"
import { Search as SearchImpl } from "./search"

export default { title: "Icon/Search", component: SearchImpl }

export const Search = (args: ComponentProps<typeof SearchImpl>) => <SearchImpl {...args} />
