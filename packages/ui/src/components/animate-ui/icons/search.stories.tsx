import type { ComponentProps } from "react"
import { Search as SearchImpl } from "./search"

export default {
  title: "Icon/Search",
  component: SearchImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Search = (args: ComponentProps<typeof SearchImpl>) => <SearchImpl {...args} />
