import type { ComponentProps } from "react"
import { Cherry as CherryImpl } from "./cherry"

export default { title: "Icon/Cherry", component: CherryImpl }

export const Cherry = (args: ComponentProps<typeof CherryImpl>) => <CherryImpl {...args} />
