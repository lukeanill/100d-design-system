import type { ComponentProps } from "react"
import { RefreshCcw as RefreshCcwImpl } from "./refresh-ccw"

export default { title: "Icon/Refresh Ccw", component: RefreshCcwImpl }

export const RefreshCcw = (args: ComponentProps<typeof RefreshCcwImpl>) => <RefreshCcwImpl {...args} />
