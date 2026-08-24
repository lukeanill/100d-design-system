import type { ComponentProps } from "react"
import { Expand as ExpandImpl } from "./expand"

export default { title: "Icon/Expand", component: ExpandImpl }

export const Expand = (args: ComponentProps<typeof ExpandImpl>) => <ExpandImpl {...args} />
