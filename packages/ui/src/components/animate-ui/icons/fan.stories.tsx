import type { ComponentProps } from "react"
import { Fan as FanImpl } from "./fan"

export default { title: "Icon/Fan", component: FanImpl }

export const Fan = (args: ComponentProps<typeof FanImpl>) => <FanImpl {...args} />
