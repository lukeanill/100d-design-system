import type { ComponentProps } from "react"
import { RotateCcwKey as RotateCcwKeyImpl } from "./rotate-ccw-key"

export default { title: "Icon/Rotate Ccw Key", component: RotateCcwKeyImpl }

export const RotateCcwKey = (args: ComponentProps<typeof RotateCcwKeyImpl>) => <RotateCcwKeyImpl {...args} />
