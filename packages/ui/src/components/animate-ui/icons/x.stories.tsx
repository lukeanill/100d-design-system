import type { ComponentProps } from "react"
import { X as XImpl } from "./x"

export default { title: "Icon/X", component: XImpl }

export const X = (args: ComponentProps<typeof XImpl>) => <XImpl {...args} />
