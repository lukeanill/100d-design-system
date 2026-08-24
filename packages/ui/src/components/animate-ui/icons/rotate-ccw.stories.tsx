import type { ComponentProps } from "react"
import { RotateCcw as RotateCcwImpl } from "./rotate-ccw"

export default { title: "Icon/Rotate Ccw", component: RotateCcwImpl }

export const RotateCcw = (args: ComponentProps<typeof RotateCcwImpl>) => <RotateCcwImpl {...args} />
