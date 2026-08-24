import type { ComponentProps } from "react"
import { RefreshCw as RefreshCwImpl } from "./refresh-cw"

export default { title: "Icon/Refresh Cw", component: RefreshCwImpl }

export const RefreshCw = (args: ComponentProps<typeof RefreshCwImpl>) => <RefreshCwImpl {...args} />
