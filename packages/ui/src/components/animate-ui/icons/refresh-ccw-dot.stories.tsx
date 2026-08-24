import type { ComponentProps } from "react"
import { animations as animationsImpl } from "./refresh-ccw-dot"

export default { title: "Icon/Refresh Ccw Dot", component: animationsImpl }

export const RefreshCcwDot = (args: ComponentProps<typeof animationsImpl>) => <animationsImpl {...args} />
