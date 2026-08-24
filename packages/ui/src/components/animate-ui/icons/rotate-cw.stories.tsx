import type { ComponentProps } from "react"
import { RotateCw as RotateCwImpl } from "./rotate-cw"

export default { title: "Icon/Rotate Cw", component: RotateCwImpl }

export const RotateCw = (args: ComponentProps<typeof RotateCwImpl>) => <RotateCwImpl {...args} />
